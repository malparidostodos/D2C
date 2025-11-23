import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useSmoothScroll } from './SmoothScroll'

const Background3D = () => {
    const containerRef = useRef(null)
    const { lenis } = useSmoothScroll()
    const scrollRef = useRef(0)

    useEffect(() => {
        if (!containerRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        // Add subtle fog for depth
        scene.fog = new THREE.FogExp2(0xf0f1fa, 0.002)

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        containerRef.current.appendChild(renderer.domElement)

        // Particles
        const particlesGeometry = new THREE.BufferGeometry()
        const particlesCount = 700 // Number of particles
        const posArray = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles in a wide area
            posArray[i] = (Math.random() - 0.5) * 15
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

        // Create a circular texture for particles
        const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png')

        const material = new THREE.PointsMaterial({
            size: 0.05,
            map: sprite,
            transparent: true,
            color: 0x0046b8, // Primary blue color
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        const particlesMesh = new THREE.Points(particlesGeometry, material)
        scene.add(particlesMesh)

        // Mouse interaction
        let mouseX = 0
        let mouseY = 0
        let targetX = 0
        let targetY = 0

        const windowHalfX = window.innerWidth / 2
        const windowHalfY = window.innerHeight / 2

        const onDocumentMouseMove = (event) => {
            mouseX = (event.clientX - windowHalfX)
            mouseY = (event.clientY - windowHalfY)
        }

        document.addEventListener('mousemove', onDocumentMouseMove)

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        // Animation loop
        const animate = () => {
            targetX = mouseX * 0.001
            targetY = mouseY * 0.001

            // Gentle rotation based on mouse
            particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y)
            particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x)

            // Scroll influence
            // We use scrollRef.current which is updated by the lenis listener
            const scrollSpeed = scrollRef.current * 0.0005
            particlesMesh.rotation.z += 0.001 + scrollSpeed
            particlesMesh.position.y = -scrollRef.current * 0.002 // Move particles up/down with scroll

            renderer.render(scene, camera)
            requestAnimationFrame(animate)
        }

        animate()

        // Lenis listener for scroll values
        const onScroll = (e) => {
            scrollRef.current = e.scroll
        }

        if (lenis) {
            lenis.on('scroll', onScroll)
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            document.removeEventListener('mousemove', onDocumentMouseMove)
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement)
            }
            if (lenis) {
                lenis.off('scroll', onScroll)
            }
            // Cleanup Three.js resources
            particlesGeometry.dispose()
            material.dispose()
            renderer.dispose()
        }
    }, [lenis])

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60"
            style={{ background: 'linear-gradient(to bottom, #f0f1fa 0%, #e4e6ef 100%)' }}
        />
    )
}

export default Background3D
