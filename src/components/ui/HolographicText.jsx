import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const HolographicText = ({ text = 'MEMBRESIAS' }) => {
  const containerRef = useRef(null)
  const textElementRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const meshRef = useRef(null)
  const animationFrameRef = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.offsetWidth || window.innerWidth
    const height = containerRef.current.offsetHeight || 600

    // Crear contenedor para múltiples textos
    const textContainer = document.createElement('div')
    textContainer.className = 'holographic-text-container'
    textContainer.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      pointer-events: none;
      z-index: 2;
      width: 100%;
      height: auto;
    `
    
    // Crear múltiples instancias del texto
    const textElements = []
    const numTexts = 3 // Número de repeticiones
    
    for (let i = 0; i < numTexts; i++) {
      const textElement = document.createElement('div')
      textElement.textContent = text
      textElement.className = 'holographic-text-overlay'
      textElement.setAttribute('data-index', i)
      textElement.style.cssText = `
        font-size: clamp(6rem, 20vw, 20rem);
        font-weight: 700;
        font-family: 'DM Sans', sans-serif;
        color: rgba(0, 0, 0, 0.05);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        user-select: none;
        pointer-events: none;
        white-space: nowrap;
        filter: blur(0.5px);
        transition: all 0.3s ease;
        line-height: 1.2;
        display: block;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
      `
      textContainer.appendChild(textElement)
      textElements.push(textElement)
    }
    
    containerRef.current.appendChild(textContainer)
    textElementRef.current = textElements // Guardar array de elementos
    
    // Debug: verificar que se crearon los elementos
    console.log('Text elements created:', textElements.length)

    // Crear escena Three.js
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
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.zIndex = '1'
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Shader simple pero efectivo
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
      varying vec2 vUv;
      
      vec3 iridescent(float t) {
        t = mod(t, 1.0);
        vec3 c1 = vec3(0.0, 0.5, 1.0);
        vec3 c2 = vec3(1.0, 0.0, 0.5);
        vec3 c3 = vec3(1.0, 0.5, 0.0);
        vec3 c4 = vec3(0.0, 1.0, 0.5);
        
        if (t < 0.25) return mix(c1, c2, t * 4.0);
        else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
        else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
        else return mix(c4, c1, (t - 0.75) * 4.0);
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse / uResolution.xy;
        float dist = distance(uv, mouse);
        
        float wave = sin(dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
        float hologram = sin(uv.x * 30.0 + uTime * 2.0) * sin(uv.y * 25.0 + uTime * 1.5) * 0.5 + 0.5;
        float effect = mix(hologram, wave, 0.5);
        
        vec3 color = iridescent(uv.x * 0.5 + uv.y * 0.3 + uTime * 0.1);
        
        float alpha = 0.05;
        if (dist < 0.5) {
          alpha = mix(0.05, 0.2, 1.0 - dist / 0.5);
        }
        
        gl_FragColor = vec4(color * effect, alpha);
      }
    `

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(width / 2, height / 2) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Manejar mouse - escuchar en toda la sección, no solo en el contenedor
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // Verificar si el mouse está dentro de la sección
      const isInSection = e.clientX >= rect.left && 
                          e.clientX <= rect.right && 
                          e.clientY >= rect.top && 
                          e.clientY <= rect.bottom
      
      if (!isInSection) return
      
      const x = e.clientX - rect.left
      const y = rect.height - (e.clientY - rect.top)
      material.uniforms.uMouse.value.set(x, y)
      
      // Efecto en todos los textos HTML
      if (textElementRef.current && Array.isArray(textElementRef.current)) {
        const relX = (e.clientX - rect.left) / rect.width
        const relY = (e.clientY - rect.top) / rect.height
        
        textElementRef.current.forEach((textElement) => {
          textElement.style.color = 'transparent'
          textElement.style.background = `linear-gradient(${relX * 360}deg, 
            rgba(0, 150, 255, 0.3) 0%,
            rgba(255, 0, 150, 0.3) 25%,
            rgba(255, 100, 0, 0.3) 50%,
            rgba(0, 255, 150, 0.3) 75%,
            rgba(0, 150, 255, 0.3) 100%
          )`
          textElement.style.backgroundClip = 'text'
          textElement.style.webkitBackgroundClip = 'text'
          textElement.style.webkitTextFillColor = 'transparent'
          textElement.style.textShadow = `
            2px 0 0 rgba(255, 0, 150, 0.2),
            -2px 0 0 rgba(0, 255, 255, 0.2),
            0 2px 0 rgba(0, 255, 150, 0.2),
            0 -2px 0 rgba(255, 100, 0, 0.2)
          `
          textElement.style.mixBlendMode = 'screen'
        })
      }
    }

    const handleMouseLeave = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // Verificar si el mouse realmente salió de la sección
      const isInSection = e.clientX >= rect.left && 
                          e.clientX <= rect.right && 
                          e.clientY >= rect.top && 
                          e.clientY <= rect.bottom
      
      if (isInSection) return
      
      if (textElementRef.current && Array.isArray(textElementRef.current)) {
        textElementRef.current.forEach((textElement) => {
          textElement.style.color = 'rgba(0, 0, 0, 0.05)'
          textElement.style.background = 'none'
          textElement.style.backgroundClip = 'unset'
          textElement.style.webkitBackgroundClip = 'unset'
          textElement.style.webkitTextFillColor = 'unset'
          textElement.style.textShadow = 'none'
          textElement.style.mixBlendMode = 'normal'
        })
      }
    }

    // Escuchar eventos en window para capturar el mouse en toda la sección
    window.addEventListener('mousemove', handleMouseMove)
    
    // Encontrar el elemento padre (la sección) para detectar cuando el mouse sale
    const sectionElement = containerRef.current.closest('section')
    if (sectionElement) {
      sectionElement.addEventListener('mouseleave', handleMouseLeave)
    } else {
      // Fallback: usar el contenedor si no hay sección
      containerRef.current.addEventListener('mouseleave', handleMouseLeave)
    }

    // Animación
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      if (material.uniforms) {
        material.uniforms.uTime.value += 0.016
      }
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return
      const newWidth = containerRef.current.offsetWidth || window.innerWidth
      const newHeight = containerRef.current.offsetHeight || 600
      renderer.setSize(newWidth, newHeight)
      if (material.uniforms) {
        material.uniforms.uResolution.value.set(newWidth, newHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    cleanupRef.current = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      const sectionElement = containerRef.current?.closest('section')
      if (sectionElement) {
        sectionElement.removeEventListener('mouseleave', handleMouseLeave)
      } else if (containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
      }
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {}
        rendererRef.current.dispose()
      }
      
      if (textElementRef.current) {
        const textContainer = containerRef.current?.querySelector('.holographic-text-container')
        if (textContainer && textContainer.parentNode) {
          textContainer.parentNode.removeChild(textContainer)
        }
      }
      
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        meshRef.current.material.dispose()
      }
    }

    return cleanupRef.current
  }, [text])

  return (
    <div 
      ref={containerRef} 
      className="holographic-canvas-container"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    />
  )
}

export default HolographicText
