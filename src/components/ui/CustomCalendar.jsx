import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CustomCalendar = ({ selectedDate, onSelect, availability = {}, onMonthChange, minDate, maxDate, isDarkMode }) => {
    const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date())
    const { t } = useTranslation()

    const monthsData = t('common.months', { returnObjects: true });
    const currentMonths = Array.isArray(monthsData) ? monthsData : [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        return day === 0 ? 6 : day - 1 // Adjust for Monday start
    }

    const handlePrev = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        setCurrentDate(newDate)
        if (onMonthChange) {
            onMonthChange(newDate)
        }
    }

    const handleNext = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        setCurrentDate(newDate)
        if (onMonthChange) {
            onMonthChange(newDate)
        }
    }

    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(new Date(selectedDate + 'T00:00:00'))
        }
    }, [selectedDate])

    const isToday = (day) => {
        const today = new Date()
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
    }

    const isSelected = (day) => {
        if (!selectedDate) return false
        const selected = new Date(selectedDate + 'T00:00:00')
        return day === selected.getDate() &&
            currentDate.getMonth() === selected.getMonth() &&
            currentDate.getFullYear() === selected.getFullYear()
    }

    const isDisabled = (day) => {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

        if (minDate && dateToCheck < new Date(minDate)) return true
        if (maxDate && dateToCheck > new Date(maxDate)) return true

        // Check availability if provided
        if (Object.keys(availability).length > 0) {
            const dateStr = dateToCheck.toISOString().split('T')[0]
            const bookedSlots = availability[dateStr] || []
            const totalSlots = 9
            if (bookedSlots.length >= totalSlots) return true
        }

        return false
    }

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDay = getFirstDayOfMonth(currentDate)
        const days = []

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const disabled = isDisabled(i)
            days.push(
                <button
                    key={i}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disabled) {
                            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
                            // Adjust for timezone offset to ensure correct YYYY-MM-DD
                            const offset = newDate.getTimezoneOffset()
                            const adjustedDate = new Date(newDate.getTime() - (offset * 60 * 1000))
                            onSelect(adjustedDate.toISOString().split('T')[0])
                        }
                    }}
                    disabled={disabled}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors ${isSelected(i)
                        ? 'bg-blue-600 text-white font-semibold'
                        : disabled
                            ? (isDarkMode ? 'text-white/20 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
                            : (isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')
                        } ${isToday(i) && !isSelected(i) ? (isDarkMode ? 'border border-white/30' : 'border border-gray-300') : ''}`}
                >
                    {i}
                </button>
            )
        }
        return days
    }

    const daysShortData = t('common.days_short', { returnObjects: true });
    const daysShort = Array.isArray(daysShortData) ? daysShortData : ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div className="p-4 w-full max-w-[300px] mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrev(); }} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                    <ChevronLeft size={18} />
                </button>
                <span className={`font-semibold capitalize text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNext(); }} className={`p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                    <ChevronRight size={18} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysShort.map(day => (
                    <div key={day} className={`h-8 w-8 flex items-center justify-center text-xs font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {renderDays()}
            </div>
        </div>
    )
}

export default CustomCalendar
