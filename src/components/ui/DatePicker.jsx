import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import CustomCalendar from './CustomCalendar'

const DatePicker = ({ value, onChange, placeholder, isDarkMode, label, minDate, maxDate }) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDateSelect = (date) => {
        onChange(date)
        setIsOpen(false)
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString + 'T00:00:00')
        return date.toLocaleDateString()
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {label}
                </label>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${isDarkMode
                    ? `bg-[#111] border-white/10 text-white hover:bg-white/5 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`
                    : `bg-white border-gray-200 text-gray-900 hover:bg-gray-50 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`
                    }`}
            >
                <div className="flex items-center gap-2 truncate">
                    <CalendarIcon size={16} className={isDarkMode ? 'text-white/40' : 'text-gray-400'} />
                    <span className={`text-sm font-medium truncate ${!value ? (isDarkMode ? 'text-white/40' : 'text-gray-400') : ''}`}>
                        {value ? formatDate(value) : placeholder}
                    </span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute top-full left-0 mt-2 z-50 rounded-xl border shadow-xl overflow-hidden p-2 w-[320px] ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-100'
                            }`}
                    >
                        <CustomCalendar
                            selectedDate={value}
                            onSelect={handleDateSelect}
                            isDarkMode={isDarkMode}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default DatePicker
