import React, { useEffect, useRef } from 'react'

const ScrollPath = () => {
  const svgRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current

    if (!svg || !path) return

    const scroll = () => {
      const distance = window.scrollY
      const windowHeight = window.innerHeight
      
      // Calcular desde el inicio del scroll hasta antes de contacto
      const contactSection = document.querySelector('#contacto')
      const endOffset = contactSection ? contactSection.offsetTop : document.documentElement.scrollHeight
      const totalDistance = endOffset - windowHeight

      if (totalDistance <= 0) {
        const pathLength = path.getTotalLength()
        path.style.strokeDasharray = `${pathLength}`
        path.style.strokeDashoffset = `${pathLength}`
        return
      }

      const percentage = Math.min(Math.max(distance / totalDistance, 0), 1)

      const pathLength = path.getTotalLength()

      path.style.strokeDasharray = `${pathLength}`
      path.style.strokeDashoffset = `${pathLength * (1 - percentage)}`
    }

    scroll()
    window.addEventListener('scroll', scroll)

    return () => {
      window.removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="scroll-path-svg"
      width="1000"
      height="2000"
      viewBox="0 0 1000 2000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="25%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="75%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M-24.5 101C285 315 5.86278 448.291 144.223 631.238C239.404 757.091 559.515 782.846 608.808 617.456C658.101 452.067 497.627 367.073 406.298 426.797C314.968 486.521 263.347 612.858 322.909 865.537C384.086 1125.06 79.3992 1007.94 100 1261.99C144.222 1807.35 819 1325 513 1142.5C152.717 927.625 -45 1916.5 1191.5 1852"
        stroke="url(#pathGradient)"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default ScrollPath

