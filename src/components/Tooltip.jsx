import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0, x: '-50%', y: '-50%' })
    const triggerRef = useRef(null)

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const scrollX = window.scrollX
            const scrollY = window.scrollY

            let top = 0
            let left = 0
            let x = '-50%'
            let y = '-50%'

            switch (position) {
                case 'top':
                    top = rect.top + scrollY - 10
                    left = rect.left + scrollX + rect.width / 2
                    x = '-50%'
                    y = '-100%'
                    break
                case 'bottom':
                    top = rect.bottom + scrollY + 10
                    left = rect.left + scrollX + rect.width / 2
                    x = '-50%'
                    y = '0%'
                    break
                case 'left':
                    top = rect.top + scrollY + rect.height / 2
                    left = rect.left + scrollX - 10
                    x = '-100%'
                    y = '-50%'
                    break
                case 'right':
                    top = rect.top + scrollY + rect.height / 2
                    left = rect.right + scrollX + 10
                    x = '0%'
                    y = '-50%'
                    break
                default:
                    top = rect.top + scrollY
                    left = rect.left + scrollX
            }

            setCoords({ top, left, x, y })
        }
    }

    const handleMouseEnter = (e) => {
        updatePosition()
        setIsVisible(true)
        if (children.props.onMouseEnter) children.props.onMouseEnter(e)
    }

    const handleMouseLeave = (e) => {
        setIsVisible(false)
        if (children.props.onMouseLeave) children.props.onMouseLeave(e)
    }

    // Clone the child to attach ref and event listeners without adding a wrapper div
    const trigger = React.cloneElement(children, {
        ref: (node) => {
            triggerRef.current = node
            // Call the original ref if it exists
            const { ref } = children
            if (typeof ref === 'function') {
                ref(node)
            } else if (ref) {
                ref.current = node
            }
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
    })

    return (
        <>
            {trigger}
            {createPortal(
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute',
                                top: coords.top,
                                left: coords.left,
                                x: coords.x,
                                y: coords.y,
                                zIndex: 9999,
                                pointerEvents: 'none'
                            }}
                            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-[#111] border border-white/10 rounded-lg shadow-xl whitespace-nowrap leading-none"
                        >
                            {content}
                            {/* Arrow */}
                            <div
                                className="absolute w-2 h-2 bg-[#111] border-r border-b border-white/10 transform rotate-45"
                                style={{
                                    ...(position === 'top' && { bottom: '-5px', left: '50%', marginLeft: '-4px', borderTop: 'none', borderLeft: 'none' }),
                                    ...(position === 'bottom' && { top: '-5px', left: '50%', marginLeft: '-4px', borderBottom: 'none', borderRight: 'none', transform: 'rotate(225deg)' }),
                                    ...(position === 'left' && { right: '-5px', top: '50%', marginTop: '-4px', borderBottom: 'none', borderLeft: 'none', transform: 'rotate(-45deg)' }),
                                    ...(position === 'right' && { left: '-5px', top: '50%', marginTop: '-4px', borderTop: 'none', borderRight: 'none', transform: 'rotate(135deg)' }),
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}

export default Tooltip
