import React, { useEffect, useState } from 'react'
import { useSmoothScroll } from './SmoothScroll'

const CustomScrollbar = () => {
    const thumbRef = React.useRef(null)
    const [thumbHeight, setThumbHeight] = useState(30)
    const [visible, setVisible] = useState(false)
    const { lenis } = useSmoothScroll()

    useEffect(() => {
        let scrollTimeout

        const updateScrollbar = (e) => {
            // Use lenis scroll data if available, otherwise fallback to window
            const scrollTop = e ? e.scroll : (window.pageYOffset || document.documentElement.scrollTop)
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

            if (scrollHeight <= 0) {
                setVisible(false)
                return
            }

            const scrollPercent = scrollTop / scrollHeight
            const scrollbarTrack = 180
            const viewportRatio = window.innerHeight / document.documentElement.scrollHeight
            const newThumbHeight = Math.max(30, viewportRatio * scrollbarTrack)
            const newThumbPosition = scrollPercent * (scrollbarTrack - newThumbHeight)

            setThumbHeight(newThumbHeight)

            if (thumbRef.current) {
                thumbRef.current.style.transform = `translateY(${newThumbPosition}px)`
                // We use transform instead of top for better performance
            }

            setVisible(true)

            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setVisible(false)
            }, 1500)
        }

        if (lenis) {
            lenis.on('scroll', updateScrollbar)
            // Initial update
            updateScrollbar({ scroll: lenis.scroll })
        } else {
            window.addEventListener('scroll', () => updateScrollbar(), { passive: true })
        }

        window.addEventListener('resize', () => updateScrollbar(lenis ? { scroll: lenis.scroll } : undefined))

        return () => {
            if (lenis) {
                lenis.off('scroll', updateScrollbar)
            } else {
                window.removeEventListener('scroll', updateScrollbar)
            }
            window.removeEventListener('resize', updateScrollbar)
            clearTimeout(scrollTimeout)
        }
    }, [lenis])

    return (
        <div className={`scrollbar-custom ${visible ? 'visible' : ''}`} id="customScrollbar">
            <div
                ref={thumbRef}
                className="scrollbar-thumb"
                id="scrollbarThumb"
                style={{
                    height: `${thumbHeight}px`,
                    // top is removed, we use transform in JS
                }}
            ></div>
        </div>
    )
}

export default CustomScrollbar
