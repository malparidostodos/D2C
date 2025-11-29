import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LiquidTrail = () => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)
  const mouseHistoryRef = useRef([])
  const maxTrailPoints = 25

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    // Crear escena
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
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.zIndex = '9999'
    renderer.domElement.style.opacity = '1'
    document.body.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Shader de rastro líquido
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
      uniform vec2 uMousePrev1;
      uniform vec2 uMousePrev2;
      uniform vec2 uMousePrev3;
      uniform vec2 uMousePrev4;
      uniform vec2 uMousePrev5;
      uniform vec2 uMousePrev6;
      uniform vec2 uMousePrev7;
      uniform vec2 uMousePrev8;
      uniform vec2 uMousePrev9;
      uniform vec2 uMousePrev10;
      uniform vec2 uMousePrev11;
      uniform vec2 uMousePrev12;
      uniform vec2 uMousePrev13;
      uniform vec2 uMousePrev14;
      uniform vec2 uMousePrev15;
      uniform vec2 uMousePrev16;
      uniform vec2 uMousePrev17;
      uniform vec2 uMousePrev18;
      uniform vec2 uMousePrev19;
      uniform int uTrailLength;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      vec3 liquidColor(float t) {
        // Premium Dark Theme Colors (Blue/White/Silver)
        vec3 c1 = vec3(0.23, 0.51, 0.96); // Blue Accent
        vec3 c2 = vec3(1.0, 1.0, 1.0);    // White
        vec3 c3 = vec3(0.5, 0.7, 1.0);    // Light Blue
        
        float cycle = mod(t * 0.5, 1.0);
        if (cycle < 0.5) return mix(c1, c2, cycle * 2.0);
        else return mix(c2, c3, (cycle - 0.5) * 2.0);
      }
      
      float liquidDrop(vec2 uv, vec2 center, float size, float fade) {
        float dist = distance(uv, center);
        if (dist > size * 1.2) return 0.0;
        
        float normalizedDist = dist / size;
        float dropShape = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
        dropShape = pow(dropShape, 2.5);
        
        return dropShape * fade;
      }
      
      float blurredTrail(vec2 uv, vec2 center, float size, float fade) {
        float result = 0.0;
        float blurRadius = size * 0.15;
        
        int samples = 5;
        for (int i = 0; i < 5; i++) {
          float angle = float(i) * 2.0 * 3.14159 / float(samples);
          vec2 offset = vec2(cos(angle), sin(angle)) * blurRadius;
          result += liquidDrop(uv, center + offset, size, fade);
        }
        
        return result / float(samples);
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse / uResolution.xy;
        
        float trailEffect = 0.0;
        float maxTrailDist = 0.08; // Slightly smaller for elegance
        
        vec2 trailPoints[20];
        trailPoints[0] = mouse;
        trailPoints[1] = uMousePrev1 / uResolution.xy;
        trailPoints[2] = uMousePrev2 / uResolution.xy;
        trailPoints[3] = uMousePrev3 / uResolution.xy;
        trailPoints[4] = uMousePrev4 / uResolution.xy;
        trailPoints[5] = uMousePrev5 / uResolution.xy;
        trailPoints[6] = uMousePrev6 / uResolution.xy;
        trailPoints[7] = uMousePrev7 / uResolution.xy;
        trailPoints[8] = uMousePrev8 / uResolution.xy;
        trailPoints[9] = uMousePrev9 / uResolution.xy;
        trailPoints[10] = uMousePrev10 / uResolution.xy;
        trailPoints[11] = uMousePrev11 / uResolution.xy;
        trailPoints[12] = uMousePrev12 / uResolution.xy;
        trailPoints[13] = uMousePrev13 / uResolution.xy;
        trailPoints[14] = uMousePrev14 / uResolution.xy;
        trailPoints[15] = uMousePrev15 / uResolution.xy;
        trailPoints[16] = uMousePrev16 / uResolution.xy;
        trailPoints[17] = uMousePrev17 / uResolution.xy;
        trailPoints[18] = uMousePrev18 / uResolution.xy;
        trailPoints[19] = uMousePrev19 / uResolution.xy;
        
        float fades[20] = float[20](
          1.0, 0.95, 0.9, 0.85, 0.78, 0.7, 0.6, 0.5, 0.42, 0.35,
          0.28, 0.22, 0.17, 0.13, 0.1, 0.08, 0.06, 0.04, 0.03, 0.02
        );
        
        int trailLen = min(uTrailLength, 20);
        
        for (int i = 0; i < 20; i++) {
          if (i >= trailLen) break;
          float fade = fades[i];
          float size = maxTrailDist * fade;
          trailEffect += blurredTrail(uv, trailPoints[i], size, fade) * 0.9;
        }
        
        vec3 themeColor = liquidColor(uv.x * 0.3 + uv.y * 0.2 + uTime * 0.1);
        vec3 finalColor = mix(vec3(1.0), themeColor, 0.6); // More white/glassy
        
        float alpha = trailEffect * 0.15; // Very subtle
        alpha *= uHoverIntensity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev1: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev2: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev3: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev4: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev5: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev6: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev7: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev8: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev9: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev10: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev11: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev12: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev13: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev14: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev15: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev16: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev17: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev18: { value: new THREE.Vector2(width / 2, height / 2) },
        uMousePrev19: { value: new THREE.Vector2(width / 2, height / 2) },
        uTrailLength: { value: 0 },
        uHoverIntensity: { value: 1.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending, // Additive for glow effect
      depthWrite: false
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Función para detectar si el mouse está sobre un elemento interactivo
    const isHoveringInteractive = (x, y) => {
      const elements = document.elementsFromPoint(x, y)
      if (!elements || elements.length === 0) return false

      for (const element of elements) {
        if (element === renderer.domElement || element.tagName.toLowerCase() === 'canvas') {
          continue
        }

        const tagName = element.tagName.toLowerCase()
        const isClickable = tagName === 'a' || tagName === 'button' ||
          tagName === 'input' || tagName === 'select' ||
          element.onclick !== null ||
          element.getAttribute('role') === 'button' ||
          element.classList.contains('cursor-pointer') ||
          window.getComputedStyle(element).cursor === 'pointer'

        const hasHover = element.onmouseenter !== null ||
          element.onmouseover !== null ||
          element.classList.toString().includes('hover:')

        if (isClickable || hasHover) {
          return true
        }
      }
      return false
    }

    let lastUpdate = 0
    let lastMouseMoveTime = 0
    let currentOpacity = 0
    let targetHoverIntensity = 1.0

    const handleMouseMove = (e) => {
      const now = Date.now()
      lastMouseMoveTime = now
      const x = e.clientX
      const y = window.innerHeight - e.clientY

      const isHovering = isHoveringInteractive(e.clientX, e.clientY)
      targetHoverIntensity = isHovering ? 0.3 : 1.0

      if (now - lastUpdate > 20) {
        mouseHistoryRef.current.unshift(new THREE.Vector2(x, y))

        if (mouseHistoryRef.current.length > maxTrailPoints) {
          mouseHistoryRef.current.pop()
        }

        const history = mouseHistoryRef.current

        material.uniforms.uMouse.value.set(x, y)
        if (history[0]) material.uniforms.uMousePrev1.value.set(history[0].x, history[0].y)
        if (history[1]) material.uniforms.uMousePrev2.value.set(history[1].x, history[1].y)
        if (history[2]) material.uniforms.uMousePrev3.value.set(history[2].x, history[2].y)
        if (history[3]) material.uniforms.uMousePrev4.value.set(history[3].x, history[3].y)
        if (history[4]) material.uniforms.uMousePrev5.value.set(history[4].x, history[4].y)
        if (history[5]) material.uniforms.uMousePrev6.value.set(history[5].x, history[5].y)
        if (history[6]) material.uniforms.uMousePrev7.value.set(history[6].x, history[6].y)
        if (history[7]) material.uniforms.uMousePrev8.value.set(history[7].x, history[7].y)
        if (history[8]) material.uniforms.uMousePrev9.value.set(history[8].x, history[8].y)
        if (history[9]) material.uniforms.uMousePrev10.value.set(history[9].x, history[9].y)
        if (history[10]) material.uniforms.uMousePrev11.value.set(history[10].x, history[10].y)
        if (history[11]) material.uniforms.uMousePrev12.value.set(history[11].x, history[11].y)
        if (history[12]) material.uniforms.uMousePrev13.value.set(history[12].x, history[12].y)
        if (history[13]) material.uniforms.uMousePrev14.value.set(history[13].x, history[13].y)
        if (history[14]) material.uniforms.uMousePrev15.value.set(history[14].x, history[14].y)
        if (history[15]) material.uniforms.uMousePrev16.value.set(history[15].x, history[15].y)
        if (history[16]) material.uniforms.uMousePrev17.value.set(history[16].x, history[16].y)
        if (history[17]) material.uniforms.uMousePrev18.value.set(history[17].x, history[17].y)
        if (history[18]) material.uniforms.uMousePrev19.value.set(history[18].x, history[18].y)

        material.uniforms.uTrailLength.value = Math.min(history.length, 20)

        lastUpdate = now
      } else {
        material.uniforms.uMouse.value.set(x, y)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      if (material.uniforms) {
        material.uniforms.uTime.value += 0.016

        // Logic to fade out when idle
        const now = Date.now()
        const timeSinceLastMove = now - lastMouseMoveTime
        let targetOpacity = 0

        // If moved recently (within 100ms), show full opacity
        if (timeSinceLastMove < 100) {
          targetOpacity = 1
        }

        // Smoothly interpolate current opacity
        currentOpacity += (targetOpacity - currentOpacity) * 0.1

        // Apply combined intensity (hover effect * idle fade)
        material.uniforms.uHoverIntensity.value = targetHoverIntensity * currentOpacity
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
      window.removeEventListener('mousemove', handleMouseMove)
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

  return null
}

export default LiquidTrail

