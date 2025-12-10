import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMenu } from '../../hooks/useMenu'
import FinalCTA from '../home/FinalCTA'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

const FooterZone = () => {
    const { setIsFooterVisible } = useMenu()
    const footerZoneRef = useRef(null)

    useEffect(() => {
        const footerZone = footerZoneRef.current
        if (!footerZone) return

        const trigger = ScrollTrigger.create({
            trigger: footerZone,
            start: "top bottom", // Trigger when top of CTA hits bottom of viewport
            end: "bottom bottom",
            onEnter: () => setIsFooterVisible(true),
            onLeaveBack: () => setIsFooterVisible(false),
            onEnterBack: () => setIsFooterVisible(true),
            onLeave: () => { }
        })

        return () => {
            trigger.kill()
            setIsFooterVisible(false) // Reset state on unmount to prevent navbar staying hidden
        }
    }, [])

    return (
        <div ref={footerZoneRef}>
            <FinalCTA />
            <Footer />
        </div>
    )
}

export default FooterZone
