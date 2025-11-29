import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Truck, Bike, Calendar as CalendarIcon, User, Check, ChevronLeft, ChevronRight, Clock, Mail, CreditCard, Edit2, ChevronDown, ChevronUp, CheckCircle, Plus } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import VehiclePlateSelector from '../ui/VehiclePlateSelector'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { validatePlate, formatPlate } from '../../utils/vehicle'

const bookingSchema = z.object({
    vehicleType: z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        priceMultiplier: z.number(),
        description: z.string()
    }).nullable(),
    service: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        features: z.array(z.string())
    }).nullable(),
    clientInfo: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().optional(),
        plate: z.string()
    }),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required")
}).superRefine((data, ctx) => {
    if (data.clientInfo.plate && data.vehicleType) {
        const isValid = validatePlate(data.clientInfo.plate, data.vehicleType.id)
        if (!isValid) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid plate format",
                path: ["clientInfo", "plate"]
            })
        }
    }
})

const CustomCalendar = ({ selectedDate, onSelect, availability = {}, onMonthChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState('days') // days, months, years
    const { t, i18n } = useTranslation()

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

    // Notify parent when component mounts or currentDate changes
    useEffect(() => {
        if (onMonthChange) {
            onMonthChange(currentDate)
        }
    }, []) // Only on mount

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

        // Si es hoy, verificar si ya pasaron las 5 PM (17:00)
        if (checkDate.getTime() === today.getTime()) {
            const now = new Date()
            if (now.getHours() >= 17) {
                return true // Deshabilitar hoy si ya son las 5 PM o más
            }
        }

        return checkDate < today
    }

    const isFullyBooked = (day) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
        const bookedSlots = availability[dateStr] || []
        const totalSlots = 9 // Total time slots available
        return bookedSlots.length >= totalSlots
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
            const disabled = isPast(i) || isFullyBooked(i)
            const fullyBooked = isFullyBooked(i)
            days.push(
                <button
                    key={i}
                    onClick={() => !disabled && onSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0])}
                    disabled={disabled}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${isSelected(i)
                        ? 'bg-white text-black font-bold'
                        : disabled
                            ? fullyBooked && !isPast(i) ? 'text-red-500/40 cursor-not-allowed line-through' : 'text-white/20 cursor-not-allowed'
                            : 'text-white hover:bg-white/10'
                        } ${isToday(i) && !isSelected(i) ? 'border border-white/30' : ''}`}
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
        <div className="bg-[#111] p-6 rounded-3xl border border-white/10 w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="text-white font-bold capitalize">
                    {currentMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysShort.map(day => (
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
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [maxStep, setMaxStep] = useState(1) // Track furthest step reached
    const [direction, setDirection] = useState(0)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [availability, setAvailability] = useState({}) // { '2024-01-15': ['08:00', '09:00'] }
    const { t, i18n } = useTranslation()

    // Estado para usuarios autenticados
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userVehicles, setUserVehicles] = useState([])
    const [loadingVehicles, setLoadingVehicles] = useState(true)
    const [useExistingVehicle, setUseExistingVehicle] = useState(false) // Si selecciona vehículo existente

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    const { control, handleSubmit, watch, setValue, trigger, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
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
        },
        mode: 'onChange'
    })

    const formData = watch()
    // const [touched, setTouched] = useState({ plate: false, email: false }) // Removed unused state

    useEffect(() => {
        if (location.state?.selectedService) {
            if (location.state?.selectedService) {
                setValue('service', location.state.selectedService)
            }
        }
        // Handle pre-selected vehicle from dashboard
        if (location.state?.selectedVehicle) {
            // We need to wait for userVehicles to be loaded, or just set it directly if we trust the data
            // But since we load user data anyway, we can just set a flag or handle it after load
            const vehicle = location.state.selectedVehicle
            handleExistingVehicleSelect(vehicle)
        }
    }, [location.state])

    // Cargar datos del usuario si está autenticado
    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setIsAuthenticated(true)

            // Precargar email y nombre
            setValue('clientInfo.email', user.email)
            setValue('clientInfo.name', user.user_metadata?.full_name || formData.clientInfo.name)

            // Cargar vehículos del usuario
            const { data: vehiclesData } = await supabase
                .from('user_vehicles')
                .select('*')
                .order('is_primary', { ascending: false })

            setUserVehicles(vehiclesData || [])

            // Solo empezar en paso 0 si NO hay un vehículo pre-seleccionado desde el dashboard
            // if (!location.state?.selectedVehicle) {
            //     setStep(0)
            //     setMaxStep(0)
            // }
        }
        setLoadingVehicles(false)
    }

    // Fetch availability when entering step 4 or when date changes
    useEffect(() => {
        if (step === 4) {
            fetchMonthAvailability()
        }
    }, [step])

    const fetchMonthAvailability = async (targetDate = null) => {
        const currentDate = targetDate || (formData.date ? new Date(formData.date + 'T00:00:00') : new Date())
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        // Usar RPC para obtener TODAS las reservas (ignora RLS)
        // Esto asegura que veamos reservas de TODOS los usuarios, no solo del actual
        const { data, error } = await supabase
            .rpc('get_global_availability', {
                start_date: firstDay.toISOString().split('T')[0],
                end_date: lastDay.toISOString().split('T')[0]
            })

        if (error) {
            console.error('Error fetching global availability:', error)
            // Fallback: intentar con query normal (puede estar limitado por RLS)
            const fallback = await supabase
                .from('bookings')
                .select('booking_date, booking_time')
                .gte('booking_date', firstDay.toISOString().split('T')[0])
                .lte('booking_date', lastDay.toISOString().split('T')[0])
                .not('status', 'eq', 'cancelled')

            if (fallback.error) {
                console.error('Fallback query also failed:', fallback.error)
                return
            }
            // Usar datos del fallback si RPC falla
            buildAvailabilityMap(fallback.data)
            return
        }

        buildAvailabilityMap(data)
    }

    // Helper para construir el mapa de disponibilidad
    const buildAvailabilityMap = (bookings) => {
        const availabilityMap = {}
        bookings?.forEach(booking => {
            const dateStr = booking.booking_date
            if (!availabilityMap[dateStr]) {
                availabilityMap[dateStr] = []
            }
            // Normalizar SIEMPRE el formato de tiempo a HH:MM (quitar segundos si existen)
            let timeStr = booking.booking_time
            if (typeof timeStr === 'string' && timeStr.length > 5) {
                timeStr = timeStr.substring(0, 5) // "08:00:00" -> "08:00"
            }
            availabilityMap[dateStr].push(timeStr)
        })

        setAvailability(availabilityMap)
    }

    // Handler when the month changes in the calendar
    const handleMonthChange = (newDate) => {
        if (step === 4) {
            fetchMonthAvailability(newDate)
        }
    }

    const vehicleTypes = [
        { id: 'car', name: t('booking.vehicle_types.car.name'), image: '/images/vehiculos/sedan.png', priceMultiplier: 1, description: t('booking.vehicle_types.car.description') },
        { id: 'suv', name: t('booking.vehicle_types.suv.name'), image: '/images/vehiculos/suv.png', priceMultiplier: 1.2, description: t('booking.vehicle_types.suv.description') },
        { id: 'motorcycle', name: t('booking.vehicle_types.motorcycle.name'), image: '/images/vehiculos/bike.png', priceMultiplier: 0.8, description: t('booking.vehicle_types.motorcycle.description') },
    ]

    const services = [
        {
            id: 'basic',
            name: t('booking.services.basic.name'),
            price: 50000,
            description: t('booking.services.basic.description'),
            features: t('booking.services.basic.features', { returnObjects: true })
        },
        {
            id: 'premium',
            name: t('booking.services.premium.name'),
            price: 120000,
            description: t('booking.services.premium.description'),
            features: t('booking.services.premium.features', { returnObjects: true })
        },
        {
            id: 'ceramic',
            name: t('booking.services.ceramic.name'),
            price: 800000,
            description: t('booking.services.ceramic.description'),
            features: t('booking.services.ceramic.features', { returnObjects: true })
        },
        {
            id: 'interior',
            name: t('booking.services.interior.name'),
            price: 250000,
            description: t('booking.services.interior.description'),
            features: t('booking.services.interior.features', { returnObjects: true })
        }
    ]

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ]

    const nextStep = async () => {
        let fieldsToValidate = []
        if (step === 1) fieldsToValidate = ['vehicleType']
        if (step === 2) fieldsToValidate = ['service']
        if (step === 3) fieldsToValidate = ['clientInfo.name', 'clientInfo.email', 'clientInfo.plate']
        if (step === 4) fieldsToValidate = ['date', 'time']

        if (fieldsToValidate.length > 0) {
            const isStepValid = await trigger(fieldsToValidate)
            if (!isStepValid) return
        }
        setDirection(1)
        let next = step + 1

        // Si usa vehículo existente, saltar de paso 2 a paso 4 (omitir detalles)
        if (useExistingVehicle && step === 2) {
            next = 4
        }

        next = Math.min(next, 5)
        setStep(next)
        setMaxStep(prev => Math.max(prev, next))
    }

    const prevStep = () => {
        setDirection(-1)
        let prev = step - 1

        // Si usa vehículo existente, saltar los pasos deshabilitados (1 y 3)
        if (useExistingVehicle) {
            // Desde paso 4 (Fecha) → ir a paso 2 (Servicio), saltando paso 3 (Detalles)
            if (step === 4) {
                prev = 2
            }
            // Desde paso 2 (Servicio) → ir a paso 0 (Selector de vehículos), saltando paso 1 (Tipo)
            else if (step === 2) {
                prev = 0
            }
        }
        // Si está en paso 1 y es usuario autenticado (añadiendo vehículo nuevo), volver a paso 0
        else if (step === 1 && isAuthenticated) {
            prev = 0
        }

        setStep(Math.max(prev, 0))
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
            setValue('vehicleType', type)
            setValue('clientInfo.plate', '')
            // setTouched({ ...touched, plate: false }) // Removed
            // Reset maxStep because subsequent steps (like plate validation) are now invalid/unchecked
            setMaxStep(2)
        }
        nextStep()
    }

    // Seleccionar vehículo existente del usuario
    const handleExistingVehicleSelect = (vehicle) => {
        setUseExistingVehicle(true)

        // Mapear tipo de vehículo
        const vehicleTypeMap = {
            'car': vehicleTypes[0],
            'suv': vehicleTypes[1],
            'motorcycle': vehicleTypes[2]
        }

        setValue('vehicleType', vehicleTypeMap[vehicle.vehicle_type])
        setValue('clientInfo.plate', vehicle.plate)

        // Ir directamente a paso 2 (servicios)
        setDirection(1)
        setStep(2)
        setMaxStep(2)
    }

    // Añadir vehículo nuevo desde paso 0
    const handleAddNewVehicle = () => {
        setUseExistingVehicle(false)
        setDirection(1)
        setStep(1)
        setMaxStep(1)
    }

    const handleServiceSelect = (service) => {
        setValue('service', service)
        nextStep()
    }



    // Removed handleClientInfoChange, handleBlur, isPlateValid, isEmailValid as they are replaced by react-hook-form logic

    const handleDateSelect = (date) => {
        setValue('date', date)
        setValue('time', '') // Reset time when date changes
        // Fetch availability for the selected date's month if not already fetched
        const selectedDate = new Date(date + 'T00:00:00')
        fetchMonthAvailability(selectedDate)
    }

    const handleTimeSelect = (time) => {
        setValue('time', time)
    }

    const isTimeSlotTaken = (time) => {
        if (!formData.date) return false
        const bookedSlots = availability[formData.date] || []
        return bookedSlots.includes(time)
    }

    const formatDateLong = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString + 'T00:00:00')
        return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)
    }

    const handleConfirm = async () => {
        let { data: { user } } = await supabase.auth.getUser()
        let newUserCredentials = null
        let newlyCreatedUser = null

        // Si no hay usuario autenticado, crear cuenta automáticamente
        if (!user) {
            try {
                const email = formData.clientInfo.email
                const password = formData.clientInfo.plate.replace(/-/g, '') // Usar placa sin guiones como contraseña

                // Crear cuenta
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: formData.clientInfo.name || '',
                            phone: formData.clientInfo.phone || ''
                        }
                    }
                })

                if (signUpError) {
                    console.error('Error creating user account:', signUpError)
                    // Continuar con la reserva aunque falle la creación de cuenta
                } else {
                    // console.log('User account created successfully:', signUpData.user?.id)
                    // Guardar credenciales para mostrar en la confirmación
                    newUserCredentials = { email, password }
                    newlyCreatedUser = signUpData.user

                    // Iniciar sesión automáticamente con las credenciales creadas
                    // para obtener un token válido para invocar el edge function
                    try {
                        const { error: signInError } = await supabase.auth.signInWithPassword({
                            email,
                            password
                        })

                        if (signInError) {
                            console.error('Error signing in after account creation:', signInError)
                        } else {
                            // console.log('User signed in successfully after account creation')
                        }
                    } catch (signInErr) {
                        console.error('Exception during auto sign-in:', signInErr)
                    }

                    // Actualizar usuario para la reserva
                    user = signUpData.user
                }
            } catch (createError) {
                console.error('Error creating user:', createError)
                // Continuar con la reserva
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                user_id: user?.id || null,
                vehicle_plate: formData.clientInfo.plate,
                vehicle_type: formData.vehicleType.id,
                service_id: formData.service.id,
                client_name: formData.clientInfo.name,
                client_email: formData.clientInfo.email,
                client_phone: formData.clientInfo.phone || null,
                booking_date: formData.date,
                booking_time: formData.time,
                total_price: formData.service.price * formData.vehicleType.priceMultiplier
            }])
            .select()

        if (error) {
            console.error('Error creating booking:', error)
            toast.error(t('booking.create_error'))
            return
        }

        // Enviar correo de confirmación
        try {
            // console.log('Attempting to send booking confirmation email')
            // console.log('New user credentials:', newUserCredentials ? 'Credentials exist' : 'No credentials')

            // Usar fetch directo para evitar problemas de autenticación de usuario
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
            const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
            const functionUrl = `${SUPABASE_URL}/functions/v1/send-booking-confirmation`

            const emailResponse = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    clientName: formData.clientInfo.name,
                    clientEmail: formData.clientInfo.email,
                    bookingDate: formatDateLong(formData.date),
                    bookingTime: formData.time,
                    serviceName: formData.service.name,
                    vehicleType: formData.vehicleType.name,
                    vehiclePlate: formData.clientInfo.plate,
                    totalPrice: formData.service.price * formData.vehicleType.priceMultiplier,
                    // Incluir credenciales si se creó una nueva cuenta
                    newUserEmail: newUserCredentials?.email,
                    newUserPassword: newUserCredentials?.password
                })
            })

            const result = await emailResponse.json()
            // console.log('Email response status:', emailResponse.status)
            // console.log('Email response:', result)

            if (!emailResponse.ok) {
                console.error('Error sending confirmation email:', result)
            } else {
                // console.log('Confirmation email sent successfully')
            }
        } catch (emailError) {
            console.error('Error invoking email function:', emailError)
            // No bloqueamos la reserva si falla el correo
        }

        // Guardar credenciales en el estado para mostrar en la confirmación
        if (newUserCredentials) {
            setValue('newUserCredentials', newUserCredentials)
        }

        setIsConfirmed(true)
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

    if (isConfirmed) {
        return (
            <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
                <Helmet>
                    <title>{t('booking.confirmed_title')} | Ta' To' Clean</title>
                    <meta name="description" content={t('booking.confirmed_message')} />
                </Helmet>
                <h1 className="sr-only">{t('booking.confirmed_title')}</h1>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
                >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                        {t('booking.confirmed_title')}
                    </h2>
                    <p className="text-white/60 mb-8 text-lg">
                        {t('booking.confirmed_message')} <span className="text-white font-medium">{formData.clientInfo.email}</span>.
                    </p>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left space-y-4">
                        <div className="flex justify-between">
                            <span className="text-white/40">{t('booking.steps.date')}</span>
                            <span className="text-white font-medium capitalize">{formatDateLong(formData.date)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/40">{t('booking.time_label')}</span>
                            <span className="text-white font-medium">{formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/40">{t('booking.service')}</span>
                            <span className="text-white font-medium">{formData.service?.name}</span>
                        </div>
                    </div>

                    {/* Mostrar credenciales si se creó una nueva cuenta */}
                    {formData.newUserCredentials && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 text-left">
                            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <User size={20} />
                                {t('booking.account_created_title')}
                            </h3>
                            <p className="text-white/80 text-sm mb-4">
                                {t('booking.account_created_message')}
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                <div>
                                    <span className="text-white/40 text-sm block mb-1">{t('booking.credentials_email')}</span>
                                    <span className="text-white font-mono font-bold text-lg">{formData.newUserCredentials.email}</span>
                                </div>
                                <div>
                                    <span className="text-white/40 text-sm block mb-1">{t('booking.credentials_password')}</span>
                                    <span className="text-white font-mono font-bold text-lg">{formData.newUserCredentials.password}</span>
                                </div>
                            </div>
                            <p className="text-white/60 text-xs mt-4">
                                {t('booking.credentials_save_reminder')}
                            </p>
                        </div>
                    )}

                    <AnimatedButton onClick={() => navigate(getLocalizedPath('/'))} variant="white">
                        {t('booking.back_home')}
                    </AnimatedButton>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8 relative">
            <Helmet>
                <title>{t('booking.seo_title')}</title>
                <meta name="description" content={t('booking.seo_description')} />
            </Helmet>
            <h1 className="sr-only">{t('booking.seo_title')}</h1>
            <Link to={getLocalizedPath('/')} className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl font-display font-bold text-white tracking-tighter z-50 hover:opacity-80 transition-opacity">
                Ta' <span className="text-accent">To'</span> Clean
            </Link>
            <div className="max-w-6xl mx-auto">
                {/* Progress Bar - Solo mostrar si no es paso 0 */}
                {step > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between mb-4 px-2">
                            {[
                                t('booking.steps.vehicle'),
                                t('booking.steps.service'),
                                t('booking.steps.details'),
                                t('booking.steps.date'),
                                t('booking.steps.confirm')
                            ].map((label, i) => {
                                const actualStep = i + 1
                                // Ajustar si usa vehículo existente (omite paso 1 y 3)
                                const isActiveOrPast = useExistingVehicle
                                    ? (actualStep === 3 || actualStep === 1 ? false : step > actualStep || (step === actualStep))
                                    : step > actualStep || step === actualStep
                                const isClickable = useExistingVehicle
                                    ? (actualStep === 3 || actualStep === 1 ? false : maxStep >= actualStep && actualStep < step)
                                    : maxStep >= actualStep && actualStep < step

                                return (
                                    <button
                                        key={i}
                                        onClick={() => isClickable && jumpToStep(actualStep)}
                                        disabled={!isClickable}
                                        className={`text-xs md:text-sm font-medium transition-colors ${isClickable
                                            ? 'text-white cursor-pointer hover:text-accent'
                                            : isActiveOrPast
                                                ? 'text-white'
                                                : 'text-white/20'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
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
                )}

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
                {step > 0 && (
                    <div className="fixed bottom-8 left-8 z-50">
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-[#0046b8] hover:text-white transition-colors backdrop-blur-sm font-medium"
                        >
                            <ChevronLeft size={20} />
                            {t('booking.back')}
                        </button>
                    </div>
                )}
            </div>
        </main>
    )

    function renderStep() {
        switch (step) {
            case 0:
                // Paso 0: Selector de vehículos (solo para usuarios autenticados)
                return (
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            {userVehicles.length > 0 ? 'Selecciona tu Vehículo' : 'Añade tu Primer Vehículo'}
                        </h2>
                        <p className="text-white/60 text-center -mt-4 mb-8">
                            {userVehicles.length > 0
                                ? 'Elige uno de tus vehículos guardados o añade uno nuevo'
                                : 'Registra tu vehículo para agilizar tus próximas reservas'}
                        </p>

                        {userVehicles.length === 0 ? (
                            // Sin vehículos guardados - Mostrar solo botón grande para añadir
                            <div className="max-w-md mx-auto">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddNewVehicle}
                                    className="w-full p-6 md:p-12 rounded-3xl border-2 border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center gap-6 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center">
                                        <Plus size={32} className="text-white md:w-10 md:h-10" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                            Añadir Mi Vehículo
                                        </h3>
                                        <p className="text-white/60 text-sm md:text-base">
                                            Comienza registrando tu primer vehículo
                                        </p>
                                    </div>
                                </motion.button>
                            </div>
                        ) : (
                            // Con vehículos guardados - Mostrar grid
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Vehículos existentes */}
                                {userVehicles.map((vehicle) => {
                                    const vehicleImage = vehicle.vehicle_type === 'car' ? '/images/vehiculos/sedan.png'
                                        : vehicle.vehicle_type === 'suv' ? '/images/vehiculos/suv.png'
                                            : '/images/vehiculos/bike.png'

                                    return (
                                        <motion.button
                                            key={vehicle.id}
                                            whileHover={{ scale: 1.03, y: -5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleExistingVehicleSelect(vehicle)}
                                            className="relative overflow-hidden p-6 rounded-3xl border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex flex-col items-center gap-4 transition-all duration-300 group min-h-[240px]"
                                        >
                                            {vehicle.is_primary && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                                        Principal
                                                    </span>
                                                </div>
                                            )}

                                            {vehicle.nickname && (
                                                <p className="text-white font-medium text-lg absolute top-3 right-3">
                                                    {vehicle.nickname}
                                                </p>
                                            )}

                                            <div className="flex-1 flex items-center justify-center mt-4">
                                                <img src={vehicleImage} alt={vehicle.vehicle_type} className="w-40 h-24 object-contain" />
                                            </div>

                                            <div className="text-center w-full">
                                                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                                                    {vehicle.plate}
                                                </h3>
                                                {(vehicle.brand || vehicle.model) && (
                                                    <p className="text-white/60 text-sm capitalize">
                                                        {vehicle.brand} {vehicle.model}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.button>
                                    )
                                })}

                                {/* Botón Añadir Vehículo Nuevo */}
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddNewVehicle}
                                    className="relative overflow-hidden p-6 rounded-3xl border-2 border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center gap-4 transition-all duration-300 min-h-[240px]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                        <Plus size={32} className="text-white" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            Añadir Vehículo Nuevo
                                        </h3>
                                        <p className="text-white/40 text-sm">
                                            Registra un nuevo vehículo
                                        </p>
                                    </div>
                                </motion.button>
                            </div>
                        )}
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            {t('booking.select_vehicle')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {vehicleTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVehicleSelect(type)}
                                    className={`relative overflow-hidden p-6 md:p-8 rounded-3xl border-2 flex flex-col items-center gap-6 transition-all duration-300 group ${formData.vehicleType?.id === type.id
                                        ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white'
                                        }`}
                                >
                                    <div className="p-4">
                                        <img src={type.image} alt={type.name} className="w-40 h-28 object-contain" />
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
                            {t('booking.select_service')}
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

                        {
                            formData.service && (
                                <div className="flex justify-end pt-4">
                                    <AnimatedButton
                                        onClick={nextStep}
                                    >
                                        {t('booking.next')}
                                    </AnimatedButton>
                                </div>
                            )
                        }
                    </div >
                )
            case 3:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            {t('booking.your_details')}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/60 text-sm mb-2">{t('booking.full_name')}</label>
                                <input
                                    type="text"
                                    {...control.register('clientInfo.name')}
                                    className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${errors.clientInfo?.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                                    placeholder="Juan Pérez"
                                />
                                {errors.clientInfo?.name && <p className="text-red-500 text-xs mt-1">{errors.clientInfo.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">{t('booking.email')}</label>
                                <input
                                    type="email"
                                    {...control.register('clientInfo.email')}
                                    className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${errors.clientInfo?.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                                    placeholder="juan@ejemplo.com"
                                    disabled={isAuthenticated}
                                />
                                {errors.clientInfo?.email && <p className="text-red-500 text-xs mt-1">{errors.clientInfo.email.message}</p>}
                                {!isAuthenticated && !useExistingVehicle && (
                                    <p className="text-white/40 text-xs mt-2 flex items-start gap-1.5">
                                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <span>{t('booking.email_link_notice')}</span>
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-2">{t('booking.phone')}</label>
                                <input
                                    type="tel"
                                    {...control.register('clientInfo.phone')}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                                    placeholder="300 123 4567"
                                />
                            </div>
                            <Controller
                                name="clientInfo.plate"
                                control={control}
                                render={({ field }) => (
                                    <VehiclePlateSelector
                                        value={field.value}
                                        onChange={(val) => {
                                            const formatted = formatPlate(val)
                                            if (formatted.length <= 7) {
                                                field.onChange(formatted)
                                            }
                                        }}
                                        onBlur={field.onBlur}
                                        vehicleType={formData.vehicleType}
                                        error={errors.clientInfo?.plate}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <AnimatedButton
                                onClick={nextStep}
                            >
                                {t('booking.next')}
                            </AnimatedButton>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            {t('booking.date_time')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <label className="block text-white/60 text-sm mb-4">{t('booking.select_date')}</label>
                                <CustomCalendar
                                    selectedDate={formData.date}
                                    onSelect={handleDateSelect}
                                    availability={availability}
                                    onMonthChange={handleMonthChange}
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm mb-4">{t('booking.select_time')}</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map((time) => {
                                        const isTaken = isTimeSlotTaken(time)
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => !isTaken && handleTimeSelect(time)}
                                                disabled={isTaken || !formData.date}
                                                className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.time === time
                                                    ? 'bg-white text-black scale-105 shadow-lg'
                                                    : isTaken
                                                        ? 'bg-red-500/10 text-red-500/40 cursor-not-allowed line-through border border-red-500/20'
                                                        : !formData.date
                                                            ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        )
                                    })}
                                </div>
                                {formData.date && formData.time && (
                                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-white/60 text-sm mb-1">{t('booking.selection')}</p>
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
                                {t('booking.view_summary')}
                            </AnimatedButton>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8">
                            {t('booking.confirm_booking')}
                        </h2>

                        <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4 md:gap-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3">
                                        <img src={formData.vehicleType.image} alt={formData.vehicleType.name} className="w-20 h-14 object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">{t('booking.vehicle')}</p>
                                        <p className="text-white font-bold text-lg">{formData.vehicleType.name}</p>
                                        <p className="text-white/60 text-sm">{t('booking.plate')}: {formData.clientInfo.plate}</p>
                                    </div>
                                </div>
                                {/* Solo mostrar botones de editar si NO usó vehículo existente */}
                                {!useExistingVehicle && (
                                    <div className="flex flex-row md:flex-col gap-2 md:self-center self-end">
                                        <button
                                            onClick={() => jumpToStep(1)}
                                            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
                                        >
                                            <Edit2 size={12} />
                                            {t('booking.vehicle')}
                                        </button>
                                        <button
                                            onClick={() => jumpToStep(3)}
                                            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
                                        >
                                            <Edit2 size={12} />
                                            {t('booking.plate')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4 md:gap-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <Check size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">{t('booking.service')}</p>
                                        <p className="text-white font-bold text-lg">{formData.service.name}</p>
                                        <p className="text-white/60 text-sm">{formData.service.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => jumpToStep(2)}
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 md:self-center self-end"
                                >
                                    <Edit2 size={14} />
                                    {t('booking.change')}
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4 md:gap-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <CalendarIcon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-sm">{t('booking.date_time')}</p>
                                        <p className="text-white font-bold text-lg capitalize">{formatDateLong(formData.date)} - {formData.time}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => jumpToStep(4)}
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 md:self-center self-end"
                                >
                                    <Edit2 size={14} />
                                    {t('booking.change')}
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <p className="text-white/60">{t('booking.total')}</p>
                                <p className="text-3xl font-bold text-white">
                                    ${(formData.service.price * formData.vehicleType.priceMultiplier).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <AnimatedButton
                                onClick={handleConfirm}
                                variant="accent"
                            >
                                {t('booking.confirm_booking')}
                            </AnimatedButton>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }
}

export default BookingPage