import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

const SmoothScrollContext = createContext({
    lenis: null,
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

const SmoothScroll = ({ children }) => {
    const [lenis, setLenis] = useState(null)
    const reqIdRef = useRef(null)

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        setLenis(lenisInstance)

        const raf = (time) => {
            lenisInstance.raf(time)
            reqIdRef.current = requestAnimationFrame(raf)
        }

        reqIdRef.current = requestAnimationFrame(raf)

        return () => {
            lenisInstance.destroy()
            if (reqIdRef.current) {
                cancelAnimationFrame(reqIdRef.current)
            }
        }
    }, [])

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    )
}

export default SmoothScroll
