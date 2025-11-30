import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const StatusDropdown = ({ currentStatus, onStatusChange, getStatusColor, isDarkMode }) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const statuses = [
        { value: 'pending', label: t('dashboard.status.pending', 'Pendiente') },
        { value: 'confirmed', label: t('dashboard.status.confirmed', 'Confirmada') },
        { value: 'in_progress', label: t('dashboard.status.in_progress', 'En Proceso') },
        { value: 'completed', label: t('dashboard.status.completed', 'Completada') },
        { value: 'cancelled', label: t('dashboard.status.cancelled', 'Cancelada') }
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isDarkMode
                    ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
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
                        className={`absolute right-0 mt-2 w-40 border rounded-xl shadow-xl overflow-hidden z-50 ${isDarkMode
                            ? 'bg-[#1a1a1a] border-white/10'
                            : 'bg-white border-gray-200'
                            }`}
                    >
                        {statuses.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => {
                                    onStatusChange(status.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDarkMode
                                    ? `hover:bg-white/5 ${currentStatus === status.value ? 'text-white font-medium bg-white/5' : 'text-white/60'}`
                                    : `hover:bg-gray-50 ${currentStatus === status.value ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-600'}`
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
