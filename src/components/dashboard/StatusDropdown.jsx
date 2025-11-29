import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const StatusDropdown = ({ currentStatus, onStatusChange, getStatusColor }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const statuses = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'in_progress', label: 'En Proceso' },
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' }
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentLabel = statuses.find(s => s.value === currentStatus)?.label || currentStatus

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
                <span>{currentLabel}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                        {statuses.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => {
                                    onStatusChange(status.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5 ${currentStatus === status.value ? 'text-white font-medium bg-white/5' : 'text-white/60'
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default StatusDropdown
