import React, { useState, useEffect } from 'react'

const FPSCounter = () => {
    const [fps, setFps] = useState(0)

    useEffect(() => {
        let frameCount = 0
        let lastTime = performance.now()
        let animFrameId

        const calculateFps = () => {
            const currentTime = performance.now()
            frameCount++

            if (currentTime - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
                frameCount = 0
                lastTime = currentTime
            }

            animFrameId = requestAnimationFrame(calculateFps)
        }

        animFrameId = requestAnimationFrame(calculateFps)

        return () => {
            cancelAnimationFrame(animFrameId)
        }
    }, [])

    return (
        <div className="fixed top-2 left-2 z-[9999] bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono border border-white/20 pointer-events-none">
            FPS: {fps}
        </div>
    )
}

export default FPSCounter
