import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LiquidBackground = () => {
    const containerRef = useRef(null)
    const rendererRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const meshRef = useRef(null)
    const animationFrameRef = useRef(null)

    useEffect(() => {
        const width = window.innerWidth
        const height = window.innerHeight

        // Create scene
        const scene = new THREE.Scene()
        sceneRef.current = scene

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Style for background positioning
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.top = '0'
        renderer.domElement.style.left = '0'
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.pointerEvents = 'none'
        renderer.domElement.style.zIndex = '0' // Behind content

        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement)
        }
        rendererRef.current = renderer

        // Shader for liquid effect
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

        const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractal Brownian Motion
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        // Loop of octaves
        for (int i = 0; i < 5; i++) {
          value += amplitude * snoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        
        // Aspect ratio correction
        float aspect = uResolution.x / uResolution.y;
        vec2 pos = uv;
        pos.x *= aspect;

        float t = uTime * 0.2;
        
        // Create wave-like distortion
        vec2 q = vec2(0.);
        q.x = fbm(pos + 0.00 * t);
        q.y = fbm(pos + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm(pos + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(pos + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(pos + r);

        // Colors based on the FBM value
        vec3 deepBlue = vec3(0.0, 0.1, 0.4);
        vec3 midBlue = vec3(0.0, 0.3, 0.8);
        vec3 lightBlue = vec3(0.0, 0.6, 1.0);
        vec3 highlight = vec3(0.4, 0.8, 1.0);

        vec3 color = mix(deepBlue, midBlue, clamp((f*f)*4.0, 0.0, 1.0));
        color = mix(color, lightBlue, clamp(length(q), 0.0, 1.0));
        color = mix(color, highlight, clamp(length(r.x), 0.0, 1.0));

        // Add "foam" or crests
        float foam = smoothstep(0.8, 1.0, f * 1.5);
        color += vec3(foam * 0.3);

        gl_FragColor = vec4(color, 1.0);
      }
    `

        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) }
            }
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        meshRef.current = mesh

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate)
            if (material.uniforms) {
                material.uniforms.uTime.value += 0.01
            }
            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight
            renderer.setSize(newWidth, newHeight)
            if (material.uniforms) {
                material.uniforms.uResolution.value.set(newWidth, newHeight)
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (rendererRef.current && rendererRef.current.domElement.parentNode) {
                rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement)
                rendererRef.current.dispose()
            }
            if (meshRef.current) {
                meshRef.current.geometry.dispose()
                meshRef.current.material.dispose()
            }
        }
    }, [])

    return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />
}

export default LiquidBackground
