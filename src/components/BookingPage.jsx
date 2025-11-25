import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Truck, Bike, Calendar as CalendarIcon, User, Check, ChevronLeft, ChevronRight, Clock, Mail, CreditCard, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedButton from './AnimatedButton'
import { useLocation } from 'react-router-dom'

const CustomCalendar = ({ selectedDate, onSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('days') // days, months, years

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        return day === 0 ? 6 : day - 1 // Adjust for Monday start
    }

    const handlePrev = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNext = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

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

    const isPast = (day) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        return checkDate < today
    }

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDay = getFirstDayOfMonth(currentDate)
        const days = []

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />)
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const disabled = isPast(i)
            days.push(
                <button
                    key={i}
                    onClick={() => !disabled && onSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0])}
                    disabled={disabled}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${isSelected(i)
                        ? 'bg-white text-black font-bold'
                        : disabled
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white hover:bg-white/10'
                        } ${isToday(i) && !isSelected(i) ? 'border border-white/30' : ''}`}
                >
                    {i}
                </button>
            )
        }
        return days
    }

    return (
        <div className="bg-[#111] p-6 rounded-3xl border border-white/10 w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="text-white font-bold capitalize">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="h-10 w-10 flex items-center justify-center text-white/40 text-xs font-medium">
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

const BookingPage = () => {
    const location = useLocation()
    const [step, setStep] = useState(1)
    const [maxStep, setMaxStep] = useState(1) // Track furthest step reached
    const [direction, setDirection] = useState(0)

    const [formData, setFormData] = useState({
        vehicleType: null,
        service: null,
        clientInfo: {
            name: '',
            email: '',
            phone: '',
            plate: ''
        },
        date: '',
        time: ''
    })

    const [touched, setTouched] = useState({
        plate: false,
        email: false
    })

    useEffect(() => {
        if (location.state?.selectedService) {
            setFormData(prev => ({ ...prev, service: location.state.selectedService }))
        }
    }, [location.state])

    const vehicleTypes = [
        { id: 'car', name: 'Automóvil', icon: Car, priceMultiplier: 1, description: 'Sedán, Hatchback, Coupé' },
        { id: 'suv', name: 'SUV / Camioneta', icon: Truck, priceMultiplier: 1.2, description: 'SUV, 4x4, Pick-up' },
        { id: 'motorcycle', name: 'Motocicleta', icon: Bike, priceMultiplier: 0.8, description: 'Todo tipo de motos' },
    ]

    const services = [
        {
            id: 'basic',
            name: 'Lavado Básico',
            price: 50000,
            description: 'Limpieza exterior e interior básica',
            features: ['Lavado Exterior', 'Aspirado', 'Limpieza de Tablero']
        },
        {
            id: 'premium',
            name: 'Lavado Premium',
            price: 120000,
            description: 'Detallado profundo con cera',
            features: ['Todo lo del Básico', 'Descontaminación', 'Cera de Carnauba', 'Hidratación de Plásticos']
        },
        {
            id: 'ceramic',
            name: 'Ceramic Coating',
            price: 800000,
            description: 'Protección cerámica de larga duración',
            features: ['Corrección de Pintura', 'Recubrimiento 9H', 'Garantía 2 años']
        },
        {
            id: 'interior',
            name: 'Detailing Interior',
            price: 250000,
            description: 'Restauración completa del interior',
            features: ['Limpieza de Tapicería', 'Vapor', 'Desinfección', 'Hidratación de Cuero']
        }
    ]

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ]

    const nextStep = () => {
        setDirection(1)
        const next = Math.min(step + 1, 5)
        setStep(next)
        setMaxStep(prev => Math.max(prev, next))
    }

    const prevStep = () => {
        setDirection(-1)
        setStep(prev => Math.max(prev - 1, 1))
    }

    const jumpToStep = (targetStep) => {
        // Allow jumping if target is previous OR if target has been reached before
        if (targetStep < step || targetStep <= maxStep) {
            setDirection(targetStep < step ? -1 : 1)
            setStep(targetStep)
        }
    }

    const handleVehicleSelect = (type) => {
        // If changing vehicle type, we might need to reset plate validation/data
        if (formData.vehicleType?.id !== type.id) {
            setFormData({
                ...formData,
                vehicleType: type,
                clientInfo: { ...formData.clientInfo, plate: '' }
            })
            setTouched({ ...touched, plate: false })
            // Reset maxStep because subsequent steps (like plate validation) are now invalid/unchecked
            setMaxStep(2)
        }
        nextStep()
    }

    const handleServiceSelect = (service) => {
        setFormData({ ...formData, service })
        nextStep()
    }

    const validatePlate = (plate, typeId) => {
        if (!plate) return false
        const cleanPlate = plate.replace(/-/g, '').toUpperCase()
        if (typeId === 'motorcycle') {
            return /^[A-Z]{3}\d{2}[A-Z]?$/.test(cleanPlate)
        } else {
            return /^[A-Z]{3}\d{3}$/.test(cleanPlate)
        }
    }

    const formatPlate = (value) => {
        const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        if (clean.length > 3) {
            return `${clean.slice(0, 3)}-${clean.slice(3, 6)}` + (clean.length > 6 ? clean.slice(6, 7) : '')
        }
        return clean
    }

    const handleClientInfoChange = (e) => {
        const { name, value } = e.target
        if (name === 'plate') {
            const formatted = formatPlate(value)
            if (formatted.length <= 7) {
                setFormData({
                    ...formData,
                    clientInfo: { ...formData.clientInfo, plate: formatted }
                })
            }
        } else {
            setFormData({
                ...formData,
                clientInfo: { ...formData.clientInfo, [name]: value }
            })
        }
    }

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true })
    }

    const isPlateValid = () => {
        return validatePlate(formData.clientInfo.plate, formData.vehicleType?.id)
    }

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleDateSelect = (date) => {
        setFormData({ ...formData, date })
    }

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time })
    }

    const formatDateLong = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString + 'T00:00:00')
        return new Intl.DateTimeFormat('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)
    }

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            Selecciona tu Vehículo
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vehicleTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVehicleSelect(type)}
                                    className={`relative overflow-hidden p-8 rounded-3xl border-2 flex flex-col items-center gap-6 transition-all duration-300 group ${formData.vehicleType?.id === type.id
                                        ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white'
                                        }`}
                                >
                                    <div className={`p-4 rounded-full transition-colors ${formData.vehicleType?.id === type.id ? 'bg-black/10' : 'bg-white/10 group-hover:bg-white/20'
                                        }`}>
                                        <type.icon size={48} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-xl font-bold block mb-2">{type.name}</span>
                                        <span className={`text-sm ${formData.vehicleType?.id === type.id ? 'text-black/60' : 'text-white/40'}`}>
                                            {type.description}
                                        </span>
                                    </div>

                                    {formData.vehicleType?.id === type.id && (
                                        <div className="absolute top-4 right-4 text-accent">
                                            <Check size={24} className="text-black" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                    </div>
                )
            case 2:
                return (
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            Elige el Servicio
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service) => (
                                <motion.div
                                    key={service.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.service?.id === service.id
                                        ? 'bg-white/10 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                        }`}
                                    onClick={() => handleServiceSelect(service)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                        <span className="text-lg font-semibold text-white/80">
                                            ${(service.price * (formData.vehicleType?.priceMultiplier || 1)).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-white/50 text-xs">
                                                <Check size={12} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                )
            case 3:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            Tus Datos
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.clientInfo.name}
                                    onChange={handleClientInfoChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">
                                        Placa del Vehículo
                                        <span className="text-xs ml-2 text-white/40">
                                            ({formData.vehicleType?.id === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="plate"
                                        value={formData.clientInfo.plate}
                                        onChange={handleClientInfoChange}
                                        onBlur={() => handleBlur('plate')}
                                        className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors uppercase ${touched.plate && formData.clientInfo.plate && !isPlateValid() ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'
                                            }`}
                                        placeholder={formData.vehicleType?.id === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                                    />
                                    {touched.plate && formData.clientInfo.plate && !isPlateValid() && (
                                        <p className="text-red-500 text-xs mt-1">Formato de placa inválido para este vehículo</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.clientInfo.phone}
                                        onChange={handleClientInfoChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                                        placeholder="300 123 4567"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.clientInfo.email}
                                    onChange={handleClientInfoChange}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${touched.email && formData.clientInfo.email && !isEmailValid(formData.clientInfo.email) ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'
                                        }`}
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <AnimatedButton
                                onClick={nextStep}
                                disabled={!formData.clientInfo.name || !isPlateValid() || !isEmailValid(formData.clientInfo.email)}
                                className={(!formData.clientInfo.name || !isPlateValid() || !isEmailValid(formData.clientInfo.email)) ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Siguiente
                            </AnimatedButton>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            Fecha y Hora
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <label className="block text-white/60 text-sm mb-4">Selecciona Fecha</label>
                                <CustomCalendar selectedDate={formData.date} onSelect={handleDateSelect} />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-4">Selecciona Hora</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.time === time
                                                ? 'bg-white text-black scale-105 shadow-lg'
                                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                {formData.date && formData.time && (
                                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-white/60 text-sm mb-1">Selección:</p>
                                        <p className="text-white font-bold text-lg capitalize">
                                            {formatDateLong(formData.date)} - {formData.time}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-8">
                            <AnimatedButton
                                onClick={nextStep}
                                disabled={!formData.date || !formData.time}
                                className={(!formData.date || !formData.time) ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Ver Resumen
                            </AnimatedButton>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            Confirmar Reserva
                        </h2>

                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <formData.vehicleType.icon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">Vehículo</p>
                                        <p className="text-white font-bold text-lg">{formData.vehicleType.name}</p>
                                        <p className="text-white/60 text-sm">Placa: {formData.clientInfo.plate}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => jumpToStep(1)}
                                        className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
                                    >
                                        <Edit2 size={12} />
                                        Vehículo
                                    </button>
                                    <button
                                        onClick={() => jumpToStep(3)}
                                        className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
                                    >
                                        <Edit2 size={12} />
                                        Placa
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <Check size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">Servicio</p>
                                        <p className="text-white font-bold text-lg">{formData.service.name}</p>
                                        <p className="text-white/60 text-sm">{formData.service.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => jumpToStep(2)}
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
                                >
                                    <Edit2 size={14} />
                                    Cambiar
                                </button>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <CalendarIcon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">Fecha y Hora</p>
                                        <p className="text-white font-bold text-lg capitalize">{formatDateLong(formData.date)} - {formData.time}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => jumpToStep(4)}
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
                                >
                                    <Edit2 size={14} />
                                    Cambiar
                                </button>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <User size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">Cliente</p>
                                        <p className="text-white font-bold text-lg">{formData.clientInfo.name}</p>
                                        <p className="text-white/60 text-sm">{formData.clientInfo.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => jumpToStep(3)}
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
                                >
                                    <Edit2 size={14} />
                                    Cambiar
                                </button>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="text-white/60">Total Estimado</span>
                                <span className="text-3xl font-bold text-white">
                                    ${(formData.service.price * (formData.vehicleType?.priceMultiplier || 1)).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <AnimatedButton
                                onClick={() => alert('¡Reserva Confirmada! Te hemos enviado un correo con los detalles.')}
                                variant="white"
                            >
                                Confirmar Reserva
                            </AnimatedButton>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4 px-2">
                        {['Vehículo', 'Servicio', 'Datos', 'Fecha', 'Confirmar'].map((label, i) => (
                            <button
                                key={i}
                                onClick={() => jumpToStep(i + 1)}
                                disabled={step <= i + 1 && maxStep <= i}
                                className={`text-xs md:text-sm font-medium transition-colors ${step > i + 1 || maxStep > i ? 'text-white cursor-pointer hover:text-accent' : step === i + 1 ? 'text-white' : 'text-white/20'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 5) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="w-full"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons (Back) */}
                {step > 1 && (
                    <div className="fixed bottom-8 left-8 z-50">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-[#0046b8] hover:text-white transition-colors backdrop-blur-sm font-medium"
                        >
                            <ChevronLeft size={20} />
                            Volver
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingPage
