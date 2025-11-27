import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Truck, Bike, Calendar, Clock, Plus, LogOut, Trash2, Check, X } from 'lucide-react'
import AnimatedButton from './AnimatedButton'

const UserDashboard = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [vehicles, setVehicles] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddVehicle, setShowAddVehicle] = useState(false)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate('/login')
            return
        }
        setUser(session.user)
        loadUserData()
    }

    const loadUserData = async () => {
        setLoading(true)

        // Cargar vehículos
        const { data: vehiclesData } = await supabase
            .from('user_vehicles')
            .select('*')
            .order('is_primary', { ascending: false })

        setVehicles(vehiclesData || [])


        // Cargar reservas de las placas del usuario
        if (vehiclesData && vehiclesData.length > 0) {
            const plates = vehiclesData.map(v => v.plate)

            // Construir query con OR para cada placa (más compatible)
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    service:services(*)
                `)

            // Si hay solo una placa, usar eq; si hay varias, usar or
            if (plates.length === 1) {
                query = query.eq('vehicle_plate', plates[0])
            } else {
                const orConditions = plates.map(plate => `vehicle_plate.eq.${plate}`).join(',')
                query = query.or(orConditions)
            }

            const { data: bookingsData, error: bookingsError } = await query.order('booking_date', { ascending: false })

            if (bookingsError) {
                console.error('Error loading bookings:', bookingsError)
            }

            setBookings(bookingsData || [])
        }

        setLoading(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const handleDeleteVehicle = async (vehicleId, plate) => {
        if (!confirm(`¿Seguro que quieres eliminar el vehículo ${plate}?`)) {
            return
        }

        const { error } = await supabase
            .from('user_vehicles')
            .delete()
            .eq('id', vehicleId)

        if (error) {
            alert('Error al eliminar vehículo: ' + error.message)
        } else {
            loadUserData() // Recargar datos
        }
    }

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'car': return Car
            case 'suv': return Truck
            case 'motorcycle': return Bike
            default: return Car
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
        const statusMap = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            in_progress: 'En Proceso',
            completed: 'Completada',
            cancelled: 'Cancelada'
        }
        return statusMap[status] || status
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl font-display font-bold text-white tracking-tighter z-50 hover:opacity-80 transition-opacity">
                Ta' <span className="text-accent">To'</span> Clean
            </Link>

            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            >
                <LogOut size={18} />
                <span className="hidden md:inline">Cerrar Sesión</span>
            </button>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        Mi Cuenta
                    </h1>
                    <p className="text-white/60">Bienvenido, {user?.email}</p>
                </motion.div>

                {/* Vehículos */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Mis Vehículos</h2>
                        <button
                            onClick={() => setShowAddVehicle(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors font-medium"
                        >
                            <Plus size={18} />
                            Agregar Vehículo
                        </button>
                    </div>

                    {vehicles.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-white/60 mb-4">No tienes vehículos registrados</p>
                            <p className="text-white/40 text-sm">Agrega un vehículo para ver el historial de reservas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map((vehicle) => {
                                const Icon = getVehicleIcon(vehicle.vehicle_type)
                                return (
                                    <div
                                        key={vehicle.id}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors relative group"
                                    >
                                        {/* Botón de eliminar */}
                                        <button
                                            onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate)}
                                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                            title="Eliminar vehículo"
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>

                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-white/10 rounded-full">
                                                <Icon size={24} className="text-white" />
                                            </div>
                                            {vehicle.is_primary && (
                                                <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{vehicle.plate}</h3>
                                        {vehicle.nickname && (
                                            <p className="text-white/60 text-sm mb-2">{vehicle.nickname}</p>
                                        )}
                                        {(vehicle.brand || vehicle.model) && (
                                            <p className="text-white/40 text-sm">
                                                {vehicle.brand} {vehicle.model} {vehicle.year}
                                            </p>
                                        )}
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
                    <h2 className="text-2xl font-bold text-white mb-6">Historial de Servicios</h2>

                    {bookings.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <p className="text-white/60 mb-4">No tienes reservas</p>
                            <AnimatedButton href="/reserva" variant="white">
                                Hacer una Reserva
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
                                                    <span>{new Date(booking.booking_date).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>

            {/* Modal Agregar Vehículo */}
            <AddVehicleModal
                isOpen={showAddVehicle}
                onClose={() => setShowAddVehicle(false)}
                onSuccess={() => {
                    setShowAddVehicle(false)
                    loadUserData()
                }}
            />
        </div>
    )
}

// Modal para agregar vehículo
const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
    const [plate, setPlate] = useState('')
    const [vehicleType, setVehicleType] = useState('car')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [nickname, setNickname] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const vehicleTypes = [
        { id: 'car', name: 'Automóvil', icon: Car },
        { id: 'suv', name: 'SUV / Camioneta', icon: Truck },
        { id: 'motorcycle', name: 'Motocicleta', icon: Bike },
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
            setError('Formato de placa inválido')
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
                setError(`Esta placa ya está registrada por otro usuario (${bookingEmail.slice(0, 3)}***@${bookingEmail.split('@')[1]})`)
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
                setError('Esta placa ya está registrada')
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
                    <h2 className="text-2xl font-bold text-white">Agregar Vehículo</h2>
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
                        <label className="block text-white/60 text-sm mb-2">Tipo de Vehículo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {vehicleTypes.map((type) => {
                                const Icon = type.icon
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
                                        <Icon size={20} />
                                        <span className="text-xs">{type.name.split(' ')[0]}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Placa */}
                    <div>
                        <label className="block text-white/60 text-sm mb-2">
                            Placa
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
                        <label className="block text-white/60 text-sm mb-2">Apodo (opcional)</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder="Mi auto"
                        />
                    </div>

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Marca (opcional)</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">Modelo (opcional)</label>
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
                        {loading ? 'Agregando...' : 'Agregar Vehículo'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default UserDashboard
