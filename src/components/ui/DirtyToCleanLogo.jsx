import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const DirtyToCleanTwo = ({ active, className = "" }) => {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: '1ch', height: '1.5em', verticalAlign: 'middle' }}>
            <AnimatePresence mode="wait">
                {!active ? (
                    <motion.span
                        key="number"
                        initial={{ opacity: 0, y: '0.5em' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-0.5em' }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center text-inherit"
                    >
                        2
                    </motion.span>
                ) : (
                    <motion.div
                        key="arrow"
                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center text-blue-500"
                    >
                        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubbles effect */}
            <AnimatePresence>
                {active && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`bubble-${i}`}
                                initial={{ opacity: 0, scale: 0, x: 0, y: '0.2em' }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1.2, 0.5],
                                    x: (Math.random() - 0.5) * 1.5 + 'em',
                                    y: -1.5 - Math.random() * 1 + 'em'
                                }}
                                transition={{
                                    duration: 0.8 + Math.random() * 0.5,
                                    repeat: Infinity,
                                    delay: Math.random() * 0.2,
                                    ease: "easeOut"
                                }}
                                className="absolute bg-blue-400 rounded-full pointer-events-none z-10"
                                style={{
                                    width: '0.15em',
                                    height: '0.15em',
                                    bottom: "50%",
                                    left: "50%"
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

const DirtyToCleanLogo = ({ auto = false, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [autoActive, setAutoActive] = useState(false)

    useEffect(() => {
        if (!auto) return

        const interval = setInterval(() => {
            setAutoActive(prev => !prev)
        }, 3000) // Toggle every 3 seconds

        return () => clearInterval(interval)
    }, [auto])

    const active = auto ? autoActive : isHovered

    return (
        <div
            className={`flex items-center font-semibold relative cursor-pointer select-none ${className}`}
            onMouseEnter={() => !auto && setIsHovered(true)}
            onMouseLeave={() => !auto && setIsHovered(false)}
        >
            <span>Ta'</span>
            <DirtyToCleanTwo active={active} className="mx-1" />
            <span>Clean</span>
        </div>
    )
}

export default DirtyToCleanLogo
