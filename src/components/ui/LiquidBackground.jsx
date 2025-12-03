import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMenu } from '../../hooks/useMenu'

const LiquidBackground = () => {
    const containerRef = useRef(null)
    const rendererRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const meshRef = useRef(null)
    const animationFrameRef = useRef(null)
    const hoverRef = useRef(1.0)
    const currentHoverRef = useRef(1.0)
    const lastMousePosRef = useRef({ x: -1000, y: -1000 })
    const isVisibleRef = useRef(true)
    const isRunningRef = useRef(false)

    // Access menu state to pause animation when menu is open
    const { menuOpen } = useMenu()
    const isMenuOpenRef = useRef(menuOpen)

    // We need to share the animate function or trigger it. 
    // Let's use a ref to hold the animate function.
    const animateRef = useRef(null)

    // Sync ref with state and handle restart with delay
    useEffect(() => {
        let timeoutId

        if (menuOpen) {
            // Pause immediately when opening
            isMenuOpenRef.current = true
        } else {
            // Wait for curtain animation (600ms) + buffer before resuming
            timeoutId = setTimeout(() => {
                isMenuOpenRef.current = false

                // Restart animation if visible and not running
                if (isVisibleRef.current && !isRunningRef.current && animateRef.current) {
                    animateRef.current()
                }
            }, 800)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [menuOpen])

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
      uniform vec2 uMouse;
      uniform float uHover;
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

        // Mouse interaction
        vec2 mouse = uMouse / uResolution;
        mouse.x *= aspect;
        float dist = distance(pos, mouse);
        
        // Make the interaction shape irregular/liquid
        float noiseShape = snoise(pos * 10.0 + uTime * 2.0) * 0.05;
        float interaction = smoothstep(0.1 + noiseShape, 0.0, dist);
        
        // Apply hover fade
        interaction *= uHover;
        
        float t = uTime * 0.2;
        
        // Create wave-like distortion with mouse influence
        vec2 q = vec2(0.);
        q.x = fbm(pos + 0.00 * t + interaction * 0.2);
        q.y = fbm(pos + vec2(1.0) - interaction * 0.2);

        vec2 r = vec2(0.);
        r.x = fbm(pos + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(pos + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(pos + r + interaction * 0.5);

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
        
        // Add extra highlight on mouse interaction
        color += vec3(interaction * 0.2);

        gl_FragColor = vec4(color, 1.0);
      }
    `

        const geometry = new THREE.PlaneGeometry(2, 2)
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uHover: { value: 1.0 }
            }
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        meshRef.current = mesh

        const animate = () => {
            // Only request next frame if visible AND menu is closed
            if (isVisibleRef.current && !isMenuOpenRef.current) {
                isRunningRef.current = true
                animationFrameRef.current = requestAnimationFrame(animate)
            } else {
                isRunningRef.current = false
            }

            if (material.uniforms && containerRef.current) {
                material.uniforms.uTime.value += 0.01

                // Check bounds continuously (handles scroll)
                const rect = containerRef.current.getBoundingClientRect()
                const mouseX = lastMousePosRef.current.x
                const mouseY = lastMousePosRef.current.y

                // Calculate relative position
                const relX = mouseX - rect.left
                const relY = mouseY - rect.top

                const isInside = relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height

                if (isInside) {
                    material.uniforms.uMouse.value.set(relX, rect.height - relY)
                    // Restore hover if not explicitly set to 0 by interactive elements
                    if (hoverRef.current !== 0.0) {
                        currentHoverRef.current += (1.0 - currentHoverRef.current) * 0.1
                    } else {
                        currentHoverRef.current += (0.0 - currentHoverRef.current) * 0.1
                    }
                } else {
                    // Fade out if outside
                    currentHoverRef.current += (0.0 - currentHoverRef.current) * 0.1
                }

                material.uniforms.uHover.value = currentHoverRef.current
            }
            renderer.render(scene, camera)
        }

        // Store animate function in ref for external access
        animateRef.current = animate

        // Intersection Observer to pause/resume animation
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const wasVisible = isVisibleRef.current
                    isVisibleRef.current = entry.isIntersecting

                    // If becoming visible and wasn't running, restart loop
                    // But only if menu is NOT open
                    if (entry.isIntersecting && !isRunningRef.current && !isMenuOpenRef.current) {
                        animate()
                    }
                    // If becoming hidden, the loop will stop automatically at next frame due to isVisibleRef check
                })
            },
            {
                threshold: 0,
                rootMargin: '100px' // Start slightly before it enters viewport
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        // Start initial animation (if menu is not open)
        if (!isMenuOpenRef.current) {
            animate()
        }

        const handleResize = () => {
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight
            renderer.setSize(newWidth, newHeight)
            if (material.uniforms) {
                material.uniforms.uResolution.value.set(newWidth, newHeight)
            }
        }

        const handleMouseMove = (e) => {
            // Store viewport position
            lastMousePosRef.current = { x: e.clientX, y: e.clientY }

            // Check interactive elements
            const isInteractive = e.target.closest('a, button, input, textarea, select')
            hoverRef.current = isInteractive ? 0.0 : 1.0
        }

        const handleMouseLeave = () => {
            hoverRef.current = 0.0
        }

        const handleMouseEnter = () => {
            hoverRef.current = 1.0
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)
        document.body.addEventListener('mouseleave', handleMouseLeave)
        document.body.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            observer.disconnect()
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
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
