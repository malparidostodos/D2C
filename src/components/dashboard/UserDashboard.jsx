import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { Car, Truck, Bike, Calendar, Clock, Plus, LogOut, Trash2, Check, X, AlertCircle, Settings, Edit2, Shield, Sun, Moon } from 'lucide-react'
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
import DashboardSkeleton from './DashboardSkeleton'

const UserDashboard = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { isDarkMode, isAdmin } = useOutletContext()
    const queryClient = useQueryClient()
    const [user, setUser] = useState(null)

    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState(null)
    const [showAllHistory, setShowAllHistory] = useState(false)
    const [minLoading, setMinLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setMinLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    const [showEditVehicleModal, setShowEditVehicleModal] = useState(false)
    const [vehicleToEdit, setVehicleToEdit] = useState(null)

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    useEffect(() => {
        checkUser()

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

    const loading = !user || loadingVehicles || loadingBookings || minLoading

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
            toast.success(t('dashboard.delete_success') || 'VehÃ­culo eliminado correctamente')
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
        if (isDarkMode) {
            switch (status) {
                case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                case 'in_progress': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
                case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
                default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
            }
        }
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200'
            case 'completed': return 'bg-green-50 text-green-700 border-green-200'
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
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
        return <DashboardSkeleton isDarkMode={isDarkMode} />
    }

    return (
        <div className="min-h-screen">
            <SEO title={t('dashboard.seo_title', 'Mi Dashboard | TaToClean')} />

            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 md:mb-12"
            >
                <h1 className={`text-3xl md:text-5xl font-display font-bold mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('dashboard.welcome')}, <span className="capitalize">{user?.user_metadata?.full_name?.split(' ')[0]}</span>
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>{t('dashboard.subtitle', 'Gestiona tus vehículos y reservas')}</p>
            </motion.div>

            {/* Main Content Card */}
            <div className={`${isDarkMode ? 'bg-transparent' : 'bg-white rounded-[2.5rem] shadow-2xl'} p-6 md:p-12 transition-all duration-300`}>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                    >
                        <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                            <Car size={80} strokeWidth={2.5} />
                        </div>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.total_vehicles', 'Total VehÃ­culos')}</p>
                        <h3 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>{vehicles.length}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                    >
                        <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                            <Calendar size={80} strokeWidth={2.5} />
                        </div>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.active_bookings', 'Reservas Activas')}</p>
                        <h3 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>{activeBookings.length}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${isDarkMode ? 'bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 hover:border-accent/40' : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-xl hover:shadow-blue-600/20'} border rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all`}
                        onClick={() => navigate(getLocalizedPath('/reserva'))}
                    >
                        <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-20 group-hover:opacity-30 text-white'}`}>
                            <Plus size={80} />
                        </div>
                        <div className="h-full flex flex-col justify-center relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-1">{t('dashboard.new_booking')}</h3>
                            <p className={`${isDarkMode ? 'text-white/60' : 'text-blue-100'} text-sm transition-colors`}>{t('dashboard.book_now_hint', 'Agenda tu prÃ³xima cita')}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Vehicles */}
                    <div className="lg:col-span-2 space-y-10">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2 transition-colors`}>
                                    <Car className={isDarkMode ? 'text-accent' : 'text-blue-600'} size={24} strokeWidth={2.5} />
                                    {t('dashboard.my_vehicles')}
                                </h2>
                                <button
                                    onClick={() => setShowAddVehicle(true)}
                                    className={`text-sm font-medium ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-blue-600'} transition-colors flex items-center gap-1`}
                                >
                                    <Plus size={16} />
                                    {t('dashboard.add_vehicle')}
                                </button>
                            </div>

                            {vehicles.length === 0 ? (
                                <div className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-12 text-center border-dashed transition-colors`}>
                                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}>
                                        <Car size={32} strokeWidth={2.5} className={isDarkMode ? 'text-white/40' : 'text-gray-400'} />
                                    </div>
                                    <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} mb-6 transition-colors`}>{t('dashboard.no_vehicles')}</p>
                                    <button
                                        onClick={() => setShowAddVehicle(true)}
                                        className={`px-6 py-3 rounded-full ${isDarkMode ? 'bg-white text-black hover:bg-white/90' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'} font-bold transition-all`}
                                    >
                                        {t('dashboard.add_first_vehicle', 'AÃ±adir Primer VehÃ­culo')}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className={`group ${isDarkMode ? 'bg-[#111] border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'} border rounded-3xl p-6 transition-all duration-300 relative overflow-hidden`}
                                        >
                                            {/* Background Gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-white/5' : 'from-blue-50/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        {vehicle.nickname && (
                                                            <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} text-xs font-medium uppercase tracking-wider mb-1 transition-colors`}>{vehicle.nickname}</p>
                                                        )}
                                                        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight transition-colors`}>{vehicle.plate}</h3>
                                                        {(vehicle.brand || vehicle.model) && (
                                                            <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm capitalize transition-colors`}>
                                                                {vehicle.brand} {vehicle.model}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {vehicle.is_primary && (
                                                            <span className={`${isDarkMode ? 'bg-accent/20 text-accent' : 'bg-blue-100 text-blue-700'} text-[10px] font-bold px-2 py-1 rounded-full uppercase transition-colors`}>
                                                                {t('dashboard.primary')}
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditVehicle(vehicle)}
                                                            className={`p-2 ${isDarkMode ? 'hover:bg-white/10 hover:text-white text-white/20' : 'hover:bg-white hover:text-blue-600 text-gray-400 hover:shadow-sm'} rounded-full transition-colors`}
                                                            title={t('dashboard.edit_vehicle_title', 'Editar VehÃ­culo')}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVehicle(vehicle.id, vehicle.plate)}
                                                            className={`p-2 ${isDarkMode ? 'hover:bg-red-500/20 hover:text-red-400 text-white/20' : 'hover:bg-red-50 hover:text-red-500 text-gray-400'} rounded-full transition-colors`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-8">
                                                    <img
                                                        src={getVehicleImage(vehicle.vehicle_type)}
                                                        alt={vehicle.vehicle_type}
                                                        className={`w-32 h-20 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ${!isDarkMode && 'mix-blend-multiply'}`}
                                                    />
                                                    <button
                                                        onClick={() => navigate(getLocalizedPath('/reserva'), { state: { selectedVehicle: vehicle } })}
                                                        className={`px-5 py-2.5 rounded-full ${isDarkMode ? 'bg-white text-black hover:bg-white/90 shadow-white/10' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'} text-sm font-bold hover:scale-105 transition-all shadow-lg`}
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
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2 transition-colors`}>
                                <Clock className={isDarkMode ? 'text-accent' : 'text-blue-600'} size={24} strokeWidth={2.5} />
                                {t('dashboard.service_history')}
                            </h2>

                            {bookings.length === 0 ? (
                                <div className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-8 text-center transition-colors`}>
                                    <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm transition-colors`}>{t('dashboard.no_bookings')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, showAllHistory ? undefined : 5).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className={`${isDarkMode ? 'bg-[#111] border-white/10 hover:bg-white/5' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md'} border rounded-2xl p-4 transition-all group`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm transition-colors`}>{booking.service?.name}</h4>
                                                    <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-xs transition-colors`}>{new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('es-CO', { dateStyle: 'medium' })} • {booking.booking_time}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(getEffectiveStatus(booking))}`}>
                                                    {getStatusText(getEffectiveStatus(booking))}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center mt-3">
                                                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white/40' : 'text-gray-400'} text-xs transition-colors`}>
                                                    <Car size={12} />
                                                    <span>{booking.vehicle_plate}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm transition-colors`}>${booking.total_price?.toLocaleString()}</span>
                                                    {(getEffectiveStatus(booking) === 'pending' || getEffectiveStatus(booking) === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${isDarkMode
                                                                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                                : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                                                        >
                                                            {t('dashboard.cancel_booking')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {bookings.length > 5 && (
                                        <button
                                            onClick={() => setShowAllHistory(!showAllHistory)}
                                            className={`w-full py-3 text-center ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'} text-sm transition-colors`}
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
            {/* Modals */}
            <AnimatePresence>
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

                {/* Modal ConfirmaciÃ³n Cancelar */}
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
            </AnimatePresence>
        </div >
    )
}

// Modal de ConfirmaciÃ³n GenÃ©rico
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

// Modal para agregar vehÃ­culo
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

        // Si estamos editando y la placa cambiÃ³, verificar duplicados
        if (!vehicleToEdit || (vehicleToEdit && vehicleToEdit.plate !== formData.plate)) {
            // ðŸ”’ VALIDACIÃ“N DE SEGURIDAD: Verificar si la placa ya tiene reservas
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
            // Actualizar vehÃ­culo existente
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
            // Insertar nuevo vehÃ­culo
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
                        {vehicleToEdit ? t('dashboard.edit_vehicle_title', 'Editar VehÃ­culo') : t('dashboard.add_vehicle_modal.title')}
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
                    {/* Tipo de vehÃ­culo */}
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
                            : (vehicleToEdit ? t('dashboard.update_vehicle', 'Actualizar VehÃ­culo') : t('dashboard.add_vehicle_modal.add_button'))}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

// Modal para confirmar eliminaciÃ³n
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
