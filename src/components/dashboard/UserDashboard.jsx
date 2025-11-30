import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Truck, Bike, Calendar, Clock, Plus, LogOut, Trash2, Check, X, AlertCircle, Settings, Edit2 } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import Tooltip from '../ui/Tooltip'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { validatePlate, formatPlate } from '../../utils/vehicle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import SEO from '../ui/SEO'

const UserDashboard = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [user, setUser] = useState(null)

    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [showAllHistory, setShowAllHistory] = useState(false)

    const [showEditVehicleModal, setShowEditVehicleModal] = useState(false)
    const [vehicleToEdit, setVehicleToEdit] = useState(null)

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    useEffect(() => {
        checkUser()
        checkAdminStatus()

        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                () => {
                    queryClient.invalidateQueries(['bookings'])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channels)
        }
    }, [])

    useEffect(() => {
        const syncData = async () => {
            if (user?.email) {
                try {
                    await supabase.rpc('check_and_update_booking_status')
                    await supabase.rpc('link_user_data', { user_email: user.email })
                    queryClient.invalidateQueries(['vehicles'])
                    queryClient.invalidateQueries(['bookings'])
                } catch (error) {
                    console.error("Error syncing data:", error)
                }
            }
        }
        syncData()
    }, [user, queryClient])

    const checkAdminStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase.rpc('is_admin')
            setIsAdmin(!!data)
        }
    }

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate(getLocalizedPath('/login'))
            return
        }
        setUser(session.user)
    }

    const { data: vehicles = [], isLoading: loadingVehicles } = useQuery({
        queryKey: ['vehicles', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('user_vehicles')
                .select('*')
                .order('is_primary', { ascending: false })

            if (error) throw error
            return data || []
        },
        enabled: !!user,
    })

    const { data: bookings = [], isLoading: loadingBookings } = useQuery({
        queryKey: ['bookings', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    service:services(*)
                `)
                .order('booking_date', { ascending: false })

            if (error) throw error
            return data || []
        },
        enabled: !!user,
        refetchInterval: 60000,
    })

    const loading = loadingVehicles || loadingBookings

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate(getLocalizedPath('/'))
    }

    const handleEditVehicle = (vehicle) => {
        setVehicleToEdit(vehicle)
        setShowEditVehicleModal(true)
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
            toast.error(t('dashboard.delete_error') + ': ' + error.message)
        } else {
            toast.success(t('dashboard.delete_success') || 'Vehículo eliminado correctamente')
            queryClient.invalidateQueries(['vehicles'])
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
            toast.error(t('dashboard.cancel_error') + ': ' + error.message)
        } else {
            toast.success(t('dashboard.cancel_success') || 'Reserva cancelada correctamente')
            queryClient.invalidateQueries(['bookings'])
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
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'in_progress': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    const getEffectiveStatus = (booking) => {
        if (booking.status !== 'pending' && booking.status !== 'confirmed') return booking.status
        try {
            const now = new Date()
            const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }))
            const [year, month, day] = booking.booking_date.split('-').map(Number)
            const [hours, minutes, seconds] = booking.booking_time.split(':').map(Number)
            const bookingDate = new Date(year, month - 1, day, hours, minutes, seconds || 0)
            if (bookingDate < colombiaTime) {
                return 'completed'
            }
        } catch (e) {
            console.error('Error calculating effective status:', e)
        }
        return booking.status
    }

    const getStatusText = (status) => {
        return t(`dashboard.status.${status}`)
    }

    // Filter active bookings (pending or confirmed)
    const activeBookings = bookings.filter(b => {
        const status = getEffectiveStatus(b)
        return status === 'pending' || status === 'confirmed'
    })

    const nextBooking = activeBookings.length > 0 ? activeBookings[activeBookings.length - 1] : null

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">{t('common.loading')}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <SEO title={t('dashboard.title', 'Panel de Usuario')} />

            {/* Navbar Overlay */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
                <Link to={getLocalizedPath('/')} className="text-2xl font-display font-bold text-white tracking-tighter hover:opacity-80 transition-opacity">
                    Ta' <span className="text-accent">To'</span> Clean
                </Link>
            </div>

            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-3 z-50">
                {isAdmin && (
                    <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                    >
                        <Settings size={18} />
                        <span className="hidden md:inline">Admin</span>
                    </Link>
                )}
                <Link
                    to={getLocalizedPath('/profile')}
                    className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5"
                    title={t('dashboard.profile')}
                >
                    <Settings size={20} />
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline font-medium">{t('dashboard.logout')}</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">
                        {t('dashboard.welcome')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 capitalize">{user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-white/40 text-lg">
                        {t('dashboard.subtitle', 'Gestiona tus vehículos y reservas desde aquí')}
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Car size={80} />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">{t('dashboard.total_vehicles', 'Total Vehículos')}</p>
                        <h3 className="text-4xl font-bold text-white">{vehicles.length}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar size={80} />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">{t('dashboard.active_bookings', 'Reservas Activas')}</p>
                        <h3 className="text-4xl font-bold text-white">{activeBookings.length}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:border-accent/40 transition-colors"
                        onClick={() => navigate(getLocalizedPath('/reserva'))}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                            <Plus size={80} />
                        </div>
                        <div className="h-full flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-1">{t('dashboard.new_booking')}</h3>
                            <p className="text-white/60 text-sm">{t('dashboard.book_now_hint', 'Agenda tu próxima cita')}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Vehicles */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Car className="text-accent" size={24} />
                                    {t('dashboard.my_vehicles')}
                                </h2>
                                <button
                                    onClick={() => setShowAddVehicle(true)}
                                    className="text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    {t('dashboard.add_vehicle')}
                                </button>
                            </div>

                            {vehicles.length === 0 ? (
                                <div className="bg-[#111] border border-white/10 rounded-3xl p-12 text-center border-dashed">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Car size={32} className="text-white/40" />
                                    </div>
                                    <p className="text-white/60 mb-6">{t('dashboard.no_vehicles')}</p>
                                    <button
                                        onClick={() => setShowAddVehicle(true)}
                                        className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors"
                                    >
                                        {t('dashboard.add_first_vehicle', 'Añadir Primer Vehículo')}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="group bg-[#111] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                                        >
                                            {/* Background Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        {vehicle.nickname && (
                                                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">{vehicle.nickname}</p>
                                                        )}
                                                        <h3 className="text-2xl font-bold text-white tracking-tight">{vehicle.plate}</h3>
                                                        {(vehicle.brand || vehicle.model) && (
                                                            <p className="text-white/40 text-sm capitalize">
                                                                {vehicle.brand} {vehicle.model}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {vehicle.is_primary && (
                                                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                                {t('dashboard.primary')}
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditVehicle(vehicle)}
                                                            className="p-2 hover:bg-white/10 hover:text-white text-white/20 rounded-full transition-colors"
                                                            title={t('dashboard.edit_vehicle_title', 'Editar Vehículo')}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate)}
                                                            className="p-2 hover:bg-red-500/20 hover:text-red-400 text-white/20 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-8">
                                                    <img
                                                        src={getVehicleImage(vehicle.vehicle_type)}
                                                        alt={vehicle.vehicle_type}
                                                        className="w-32 h-20 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                    />
                                                    <button
                                                        onClick={() => navigate(getLocalizedPath('/reserva'), { state: { selectedVehicle: vehicle } })}
                                                        className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 hover:scale-105 transition-all shadow-lg shadow-white/10"
                                                    >
                                                        {t('dashboard.book_now')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="space-y-8">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="text-accent" size={24} />
                                {t('dashboard.service_history')}
                            </h2>

                            {bookings.length === 0 ? (
                                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 text-center">
                                    <p className="text-white/40 text-sm">{t('dashboard.no_bookings')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, showAllHistory ? undefined : 5).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="bg-[#111] border border-white/10 rounded-2xl p-4 hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">{booking.service?.name}</h4>
                                                    <p className="text-white/40 text-xs">{new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('es-CO', { dateStyle: 'medium' })} • {booking.booking_time}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(getEffectiveStatus(booking))}`}>
                                                    {getStatusText(getEffectiveStatus(booking))}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <Car size={12} />
                                                    <span>{booking.vehicle_plate}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white font-bold text-sm">${booking.total_price?.toLocaleString()}</span>
                                                    {(getEffectiveStatus(booking) === 'pending' || getEffectiveStatus(booking) === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="text-white/20 hover:text-red-400 transition-colors"
                                                            title={t('dashboard.cancel_booking')}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {bookings.length > 5 && (
                                        <button
                                            onClick={() => setShowAllHistory(!showAllHistory)}
                                            className="w-full py-3 text-center text-white/40 text-sm hover:text-white transition-colors"
                                        >
                                            {showAllHistory ? t('dashboard.show_less', 'Ver menos') : t('dashboard.view_all_history', 'Ver todo el historial')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.section>
                    </div>
                </div>
            </div>

            {/* Modal Agregar/Editar Vehículo */}
            <AddVehicleModal
                isOpen={showAddVehicle || showEditVehicleModal}
                onClose={() => {
                    setShowAddVehicle(false)
                    setShowEditVehicleModal(false)
                    setVehicleToEdit(null)
                }}
                onSuccess={() => {
                    setShowAddVehicle(false)
                    setShowEditVehicleModal(false)
                    setVehicleToEdit(null)
                    queryClient.invalidateQueries(['vehicles'])
                }}
                vehicleToEdit={vehicleToEdit}
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
                className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full text-center"
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
const addVehicleSchema = z.object({
    vehicleType: z.string(),
    plate: z.string().min(1, "Plate is required"),
    nickname: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional()
}).superRefine((data, ctx) => {
    if (!validatePlate(data.plate, data.vehicleType)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid plate format",
            path: ["plate"]
        })
    }
})

const AddVehicleModal = ({ isOpen, onClose, onSuccess, vehicleToEdit }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            vehicleType: 'car',
            plate: '',
            nickname: '',
            brand: '',
            model: ''
        }
    })

    const vehicleType = watch('vehicleType')
    const plate = watch('plate')
    const [error, setError] = useState('')

    // Reset form when modal opens/closes or vehicleToEdit changes
    useEffect(() => {
        if (isOpen) {
            if (vehicleToEdit) {
                setValue('vehicleType', vehicleToEdit.vehicle_type)
                setValue('plate', vehicleToEdit.plate)
                setValue('nickname', vehicleToEdit.nickname || '')
                setValue('brand', vehicleToEdit.brand || '')
                setValue('model', vehicleToEdit.model || '')
            } else {
                reset({
                    vehicleType: 'car',
                    plate: '',
                    nickname: '',
                    brand: '',
                    model: ''
                })
            }
            setError('')
        }
    }, [isOpen, vehicleToEdit, reset, setValue])

    const vehicleTypes = [
        { id: 'car', name: t('dashboard.vehicle_types.car'), image: '/images/vehiculos/sedan.png' },
        { id: 'suv', name: t('dashboard.vehicle_types.suv'), image: '/images/vehiculos/suv.png' },
        { id: 'motorcycle', name: t('dashboard.vehicle_types.motorcycle'), image: '/images/vehiculos/bike.png' },
    ]

    const onSubmit = async (formData) => {
        setError('')

        const { data: { user } } = await supabase.auth.getUser()

        // Si estamos editando y la placa cambió, verificar duplicados
        if (!vehicleToEdit || (vehicleToEdit && vehicleToEdit.plate !== formData.plate)) {
            // 🔒 VALIDACIÓN DE SEGURIDAD: Verificar si la placa ya tiene reservas
            const { data: existingBookings } = await supabase
                .from('bookings')
                .select('client_email')
                .eq('vehicle_plate', formData.plate)
                .limit(1)

            // Si la placa tiene reservas previas, verificar que el email coincida
            if (existingBookings && existingBookings.length > 0) {
                const bookingEmail = existingBookings[0].client_email
                if (bookingEmail !== user.email) {
                    setError(t('dashboard.add_vehicle_modal.plate_taken_error'))
                    return
                }
            }
        }

        let errorResult = null

        if (vehicleToEdit) {
            // Actualizar vehículo existente
            const { error: updateError } = await supabase
                .from('user_vehicles')
                .update({
                    plate: formData.plate,
                    vehicle_type: formData.vehicleType,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    nickname: formData.nickname || null
                })
                .eq('id', vehicleToEdit.id)

            errorResult = updateError
        } else {
            // Insertar nuevo vehículo
            const { error: insertError } = await supabase
                .from('user_vehicles')
                .insert([{
                    user_id: user.id,
                    plate: formData.plate,
                    vehicle_type: formData.vehicleType,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    nickname: formData.nickname || null
                }])

            errorResult = insertError
        }

        if (errorResult) {
            if (errorResult.code === '23505') {
                setError(t('dashboard.add_vehicle_modal.plate_exists_error'))
            } else {
                setError(errorResult.message)
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
                className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {vehicleToEdit ? t('dashboard.edit_vehicle_title', 'Editar Vehículo') : t('dashboard.add_vehicle_modal.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* ... form fields ... */}
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
                                            setValue('vehicleType', type.id)
                                            // Solo limpiar placa si cambia tipo y NO estamos editando (o si el usuario quiere cambiarla)
                                            // setValue('plate', '') 
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
                            {...register('plate')}
                            onChange={(e) => setValue('plate', formatPlate(e.target.value))}
                            className={`w-full bg-white/5 border rounded-xl p-3 text-white focus:outline-none transition-colors uppercase ${errors.plate ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                            placeholder={vehicleType === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                            maxLength={7}
                        />
                        {errors.plate && (
                            <p className="text-red-500 text-xs mt-1">{t('dashboard.add_vehicle_modal.plate_error')}</p>
                        )}
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.nickname_label')}</label>
                        <input
                            type="text"
                            {...register('nickname')}
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
                                {...register('brand')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <label className="block text-white/60 text-sm mb-2">{t('dashboard.add_vehicle_modal.model_label')}</label>
                            <input
                                type="text"
                                {...register('model')}
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
                        disabled={isSubmitting}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? (vehicleToEdit ? t('dashboard.updating', 'Actualizando...') : t('dashboard.add_vehicle_modal.adding'))
                            : (vehicleToEdit ? t('dashboard.update_vehicle', 'Actualizar Vehículo') : t('dashboard.add_vehicle_modal.add_button'))}
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
                className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full text-center"
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
