import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Truck, Bike, Calendar, Clock, Plus, LogOut, Trash2, Check, X, AlertCircle, Settings } from 'lucide-react'
import AnimatedButton from './AnimatedButton'
import Tooltip from './Tooltip'
import { useTranslation } from 'react-i18next'

const UserDashboard = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [vehicles, setVehicles] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState(null)

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate(getLocalizedPath('/login'))
            return
        }
        setUser(session.user)
        loadUserData()
    }

    const loadUserData = async () => {
        setLoading(true)

        try {
            // 1. Actualizar estados de reservas pasadas
            await supabase.rpc('check_and_update_booking_status')

            // 2. Obtener usuario actual
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 3. Vincular datos (reservas anónimas y crear vehículos)
            // Esta función RPC hace todo el trabajo pesado en el servidor
            if (user.email) {
                await supabase.rpc('link_user_data', { user_email: user.email })
            }

            // 4. Cargar vehículos (ahora incluirá los recién creados por el RPC)
            const { data: vehiclesData } = await supabase
                .from('user_vehicles')
                .select('*')
                .order('is_primary', { ascending: false })

            setVehicles(vehiclesData || [])

            // 5. Cargar reservas (ahora incluirá las vinculadas por el RPC)
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    service:services(*)
                `)
                .order('booking_date', { ascending: false })

            if (bookingsError) {
                console.error('Error loading bookings:', bookingsError)
            }

            setBookings(bookingsData || [])

        } catch (error) {
            console.error('Error in loadUserData:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate(getLocalizedPath('/'))
    }

    const handleDeleteVehicle = (vehicleId, plate) => {
        setVehicleToDelete({ id: vehicleId, plate })
        setShowDeleteModal(true)
    }

    const confirmDeleteVehicle = async () => {
        if (!vehicleToDelete) return

        const { error } = await supabase
            .from('user_vehicles')
            .delete()
            .eq('id', vehicleToDelete.id)

        if (error) {
            alert(t('dashboard.delete_error') + ': ' + error.message)
        } else {
            loadUserData()
        }
        setShowDeleteModal(false)
        setVehicleToDelete(null)
    }

    const handleCancelBooking = (bookingId) => {
        setBookingToCancel(bookingId)
        setShowCancelModal(true)
    }

    const confirmCancelBooking = async () => {
        if (!bookingToCancel) return

        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingToCancel)

        if (error) {
            alert(t('dashboard.cancel_error') + ': ' + error.message)
        } else {
            loadUserData()
        }
        setShowCancelModal(false)
        setBookingToCancel(null)
    }

    const getVehicleImage = (type) => {
        switch (type) {
            case 'car': return '/images/vehiculos/sedan.png'
            case 'suv': return '/images/vehiculos/suv.png'
            case 'motorcycle': return '/images/vehiculos/bike.png'
            default: return '/images/vehiculos/sedan.png'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
            case 'confirmed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
            case 'in_progress': return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
            case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30'
            case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
        }
    }

    const getStatusText = (status) => {
        return t(`dashboard.status.${status}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-xl">{t('common.loading')}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <Link to={getLocalizedPath('/')} className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl font-display font-bold text-white tracking-tighter z-50 hover:opacity-80 transition-opacity">
                Ta' <span className="text-accent">To'</span> Clean
            </Link>

            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-3 z-50">
                <Link
                    to={getLocalizedPath('/profile')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <Settings size={18} />
                    <span className="hidden md:inline">{t('dashboard.profile')}</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline">{t('dashboard.logout')}</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        {t('dashboard.title')}
                    </h1>
                    <p className="text-white/60">
                        {t('dashboard.welcome')}, <span className={user?.user_metadata?.full_name ? "capitalize" : ""}>{user?.user_metadata?.full_name || user?.email}</span>
                    </p>
                </motion.div>

                {/* Vehículos */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{t('dashboard.my_vehicles')}</h2>
                        <button
                            onClick={() => setShowAddVehicle(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors font-medium"
                        >
                            <Plus size={18} />
                            {t('dashboard.add_vehicle')}
                        </button>
                    </div>

                    {vehicles.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-white/60 mb-4">{t('dashboard.no_vehicles')}</p>
                            <p className="text-white/40 text-sm">{t('dashboard.add_vehicle_hint')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map((vehicle) => {
                                return (
                                    <div
                                        key={vehicle.id}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors relative group flex flex-col justify-between min-h-[220px]"
                                    >
                                        {/* Botón de eliminar */}
                                        <Tooltip content={t('dashboard.remove')} position="left">
                                            <button
                                                onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate)}
                                                className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                            >
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </Tooltip>

                                        {/* Primary Badge */}
                                        {vehicle.is_primary && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                                    {t('dashboard.primary')}
                                                </span>
                                            </div>
                                        )}

                                        {/* Content Container */}
                                        <div className="flex flex-col h-full">
                                            {/* Top: Nickname */}
                                            {vehicle.nickname && (
                                                <div className="mb-2">
                                                    <p className="text-white font-medium text-lg">{vehicle.nickname}</p>
                                                </div>
                                            )}

                                            {/* Middle: Image */}
                                            <div className="flex-1 flex items-center justify-center my-4">
                                                <img src={getVehicleImage(vehicle.vehicle_type)} alt={vehicle.vehicle_type} className="w-40 h-24 object-contain" />
                                            </div>

                                            {/* Bottom: Brand & Plate */}
                                            <div className="flex flex-col gap-3 w-full">
                                                <div className="flex items-end justify-between w-full">
                                                    {(vehicle.brand || vehicle.model) && (
                                                        <p className="text-white text-sm font-medium mb-1 capitalize">
                                                            {vehicle.brand} {vehicle.model} {vehicle.year}
                                                        </p>
                                                    )}
                                                    <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                                                        {vehicle.plate}
                                                    </h3>
                                                </div>

                                                <button
                                                    onClick={() => navigate(getLocalizedPath('/reserva'), { state: { selectedVehicle: vehicle } })}
                                                    className="w-full py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Calendar size={14} />
                                                    {t('dashboard.book_now') || 'Reservar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.section>

                {/* Historial de Reservas */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{t('dashboard.service_history')}</h2>
                        <Link to={getLocalizedPath('/reserva')}>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors font-medium text-sm">
                                <Plus size={16} />
                                {t('dashboard.new_booking')}
                            </button>
                        </Link>
                    </div>

                    {
                        bookings.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-white/60 mb-4">{t('dashboard.no_bookings')}</p>
                                <AnimatedButton href={getLocalizedPath('/reserva')} variant="white">
                                    {t('dashboard.make_booking')}
                                </AnimatedButton>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {booking.service?.name || 'Servicio'}
                                                    </h3>
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                                                        {getStatusText(booking.status)}
                                                    </span>
                                                </div>
                                                <p className="text-white/60 text-sm mb-3">
                                                    {booking.service?.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm text-white/40">
                                                    <div className="flex items-center gap-2">
                                                        <Car size={16} />
                                                        <span>{booking.vehicle_plate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} />
                                                        <span>{new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('es-CO', { dateStyle: 'medium', timeZone: 'UTC' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{booking.booking_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">
                                                    ${booking.total_price?.toLocaleString()}
                                                </p>

                                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="mt-2 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 ml-auto"
                                                    >
                                                        <X size={14} />
                                                        {t('dashboard.cancel_booking')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </motion.section >
            </div >

            {/* Modal Agregar Vehículo */}
            < AddVehicleModal
                isOpen={showAddVehicle}
                onClose={() => setShowAddVehicle(false)}
                onSuccess={() => {
                    setShowAddVehicle(false)
                    loadUserData()
                }}
            />

            {/* Modal Confirmación Cancelar */}
            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false)
                    setBookingToCancel(null)
                }}
                onConfirm={confirmCancelBooking}
                title={t('dashboard.cancel_confirm_title')}
                message={t('dashboard.cancel_confirm_message')}
                cancelText={t('dashboard.keep_booking')}
                confirmText={t('dashboard.confirm_cancel')}
            />

            <DeleteVehicleModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteVehicle}
                plate={vehicleToDelete?.plate}
            />
        </div >
    )
}

// Modal de Confirmación Genérico
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, cancelText, confirmText }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X size={32} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
                <p className="text-white/60 mb-8">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-bold"
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// Modal para agregar vehículo
const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation()
    const [plate, setPlate] = useState('')
    const [vehicleType, setVehicleType] = useState('car')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [nickname, setNickname] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const vehicleTypes = [
        { id: 'car', name: t('dashboard.vehicle_types.car'), image: '/images/vehiculos/sedan.png' },
        { id: 'suv', name: t('dashboard.vehicle_types.suv'), image: '/images/vehiculos/suv.png' },
        { id: 'motorcycle', name: t('dashboard.vehicle_types.motorcycle'), image: '/images/vehiculos/bike.png' },
    ]

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
            return `${clean.slice(0, 3)}-${clean.slice(3, 6)}${clean.length > 6 ? clean.slice(6, 7) : ''}`
        }
        return clean
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePlate(plate, vehicleType)) {
            setError(t('dashboard.add_vehicle_modal.plate_error'))
            return
        }

        setLoading(true)
        setError('')

        const { data: { user } } = await supabase.auth.getUser()

        // 🔒 VALIDACIÓN DE SEGURIDAD: Verificar si la placa ya tiene reservas
        const { data: existingBookings } = await supabase
            .from('bookings')
            .select('client_email')
            .eq('vehicle_plate', plate)
            .limit(1)

        // Si la placa tiene reservas previas, verificar que el email coincida
        if (existingBookings && existingBookings.length > 0) {
            const bookingEmail = existingBookings[0].client_email
            if (bookingEmail !== user.email) {
                setLoading(false)
                setError(t('dashboard.add_vehicle_modal.plate_taken_error'))
                return
            }
        }

        const { data, error: insertError } = await supabase
            .from('user_vehicles')
            .insert([{
                user_id: user.id,
                plate: plate,
                vehicle_type: vehicleType,
                brand: brand || null,
                model: model || null,
                nickname: nickname || null
            }])
            .select()

        setLoading(false)

        if (insertError) {
            if (insertError.code === '23505') {
                setError(t('dashboard.add_vehicle_modal.plate_exists_error'))
            } else {
                setError(insertError.message)
            }
        } else {
            onSuccess()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{t('dashboard.add_vehicle_modal.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo de vehículo */}
                    <div>
                        <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.type_label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {vehicleTypes.map((type) => {
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setVehicleType(type.id)
                                            setPlate('')
                                        }}
                                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${vehicleType === type.id
                                            ? 'bg-white text-black border-white'
                                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <img src={type.image} alt={type.name} className="w-12 h-8 object-contain" />
                                        <span className="text-xs">{type.name.split(' ')[0]}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Placa */}
                    <div>
                        <label className="block text-white/60 text-sm mb-2">
                            {t('dashboard.add_vehicle_modal.plate_label')}
                            <span className="text-xs ml-2">
                                ({vehicleType === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                            </span>
                        </label>
                        <input
                            type="text"
                            value={plate}
                            onChange={(e) => setPlate(formatPlate(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors uppercase"
                            placeholder={vehicleType === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                            maxLength={7}
                            required
                        />
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.nickname_label')}</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder={t('dashboard.add_vehicle_modal.nickname_placeholder')}
                        />
                    </div>

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.brand_label')}</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.model_label')}</label>
                            <input
                                type="text"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                placeholder="Corolla"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !validatePlate(plate, vehicleType)}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('dashboard.add_vehicle_modal.adding') : t('dashboard.add_vehicle_modal.add_button')}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

// Modal para confirmar eliminación
const DeleteVehicleModal = ({ isOpen, onClose, onConfirm, plate }) => {
    const { t } = useTranslation()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} className="text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{t('dashboard.delete_vehicle_title')}</h2>
                <p className="text-white/60 mb-8">
                    {t('dashboard.delete_vehicle_confirm', { plate })}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default UserDashboard
