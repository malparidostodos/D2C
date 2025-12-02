import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { Car, Truck, Bike, Calendar, Clock, Plus, LogOut, Trash2, Check, X, AlertCircle, Settings, Edit2, Shield, Sun, Moon, ChevronDown } from 'lucide-react'
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
import VehicleDetailsModal from './VehicleDetailsModal'

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
    const [selectedVehicle, setSelectedVehicle] = useState(null) // Para el modal de detalles
    const [statusFilter, setStatusFilter] = useState('all')
    const [vehicleFilter, setVehicleFilter] = useState('all')
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false)

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
        setSelectedVehicle(null) // Cerrar modal de detalles si está abierto
    }

    const handleUpdateVehicle = async (updatedVehicle) => {
        const { error } = await supabase
            .from('user_vehicles')
            .update({
                plate: updatedVehicle.plate,
                brand: updatedVehicle.brand,
                model: updatedVehicle.model,
                nickname: updatedVehicle.nickname
            })
            .eq('id', updatedVehicle.id)

        if (error) {
            toast.error(t('dashboard.update_error', 'Error al actualizar vehículo') + ': ' + error.message)
            return false
        } else {
            toast.success(t('dashboard.update_success', 'Vehículo actualizado correctamente'))
            queryClient.invalidateQueries(['vehicles'])
            // Actualizar el vehículo seleccionado para reflejar los cambios en el modal inmediatamente
            setSelectedVehicle(updatedVehicle)
            return true
        }
    }

    const handleDeleteVehicle = (vehicleOrId, plate) => {
        if (vehicleOrId && typeof vehicleOrId === 'object') {
            setVehicleToDelete({ id: vehicleOrId.id, plate: vehicleOrId.plate })
        } else {
            setVehicleToDelete({ id: vehicleOrId, plate })
        }
        setShowDeleteModal(true)
        setSelectedVehicle(null) // Cerrar modal de detalles si está abierto
    }

    const confirmDeleteVehicle = async () => {
        if (!vehicleToDelete) return

        // 1. Desvincular reservas asociadas
        // Anonymizamos el email para cumplir con la restricción NOT NULL
        // y usamos user_id: null para desvincular de la cuenta.
        const anonymizedEmail = `deleted_${Date.now()}_${user.email}`

        const { error: bookingError, count: bookingCount } = await supabase
            .from('bookings')
            .update({
                client_email: anonymizedEmail,
                user_id: null
            })
            .eq('vehicle_plate', vehicleToDelete.plate)
            .ilike('client_email', user.email)
            .select('id', { count: 'exact' })

        if (bookingError) {
            console.error('Error unlinking associated bookings:', bookingError)
            toast.error('Error al desvincular reservas: ' + bookingError.message)
            setShowDeleteModal(false)
            return
        }

        if (bookingCount > 0) {
            // Opcional: Notificar éxito de desvinculación
            // toast.success(`Se desvincularon ${bookingCount} reservas`)
        }

        // 2. Eliminar el vehículo de la tabla user_vehicles
        const { error, count } = await supabase
            .from('user_vehicles')
            .delete({ count: 'exact' })
            .eq('id', vehicleToDelete.id)

        if (error) {
            toast.error(t('dashboard.delete_error') + ': ' + error.message)
        } else if (count === 0) {
            toast.error(t('dashboard.delete_error') + ': ' + t('dashboard.delete_failed_count', 'No se pudo eliminar. Verifique si tiene reservas activas.'))
        } else {
            toast.success(t('dashboard.delete_success') || 'Vehículo eliminado correctamente')
            queryClient.invalidateQueries(['vehicles'])
            queryClient.invalidateQueries(['bookings'])
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

    // Calculate total spend
    const totalSpend = bookings
        .filter(b => b.status === 'completed')
        .reduce((acc, curr) => {
            const price = curr.service?.price || 0
            return acc + (typeof price === 'string' ? parseFloat(price) : price)
        }, 0)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const filteredBookings = bookings.filter(booking => {
        const effectiveStatus = getEffectiveStatus(booking)
        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'active'
                ? ['pending', 'confirmed', 'in_progress'].includes(effectiveStatus)
                : effectiveStatus === statusFilter

        const matchesVehicle = vehicleFilter === 'all' || booking.vehicle_plate === vehicleFilter

        return matchesStatus && matchesVehicle
    }).sort((a, b) => {
        const statusA = getEffectiveStatus(a)
        const statusB = getEffectiveStatus(b)

        const getPriority = (s) => {
            switch (s) {
                case 'in_progress': return 1
                case 'confirmed': return 2
                case 'pending': return 3
                case 'completed': return 4
                case 'cancelled': return 5
                default: return 6
            }
        }

        const priorityA = getPriority(statusA)
        const priorityB = getPriority(statusB)

        if (priorityA !== priorityB) {
            return priorityA - priorityB
        }

        // Same status, sort by date
        const dateA = new Date(`${a.booking_date}T${a.booking_time}`)
        const dateB = new Date(`${b.booking_date}T${b.booking_time}`)

        // For active/upcoming, sort ascending (soonest first)
        // For history (completed/cancelled), sort descending (most recent first)
        if (['in_progress', 'confirmed', 'pending'].includes(statusA)) {
            return dateA - dateB
        }
        return dateB - dateA
    })

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
                        transition={{ delay: 0 }}
                        className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                    >
                        <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                            <Car size={80} strokeWidth={2.5} />
                        </div>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.total_vehicles', 'Total Vehículos')}</p>
                        <h3 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>{vehicles.length}</h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                    >
                        <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                            <Calendar size={80} strokeWidth={2.5} />
                        </div>
                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.active_bookings', 'Reservas Activas')}</p>
                        <h3 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>{activeBookings.length}</h3>
                    </motion.div>

                    {/* Third Card: Next Appointment OR Total Spend OR New Booking */}
                    {nextBooking ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                            className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                        >
                            <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                                <Clock size={80} strokeWidth={2.5} />
                            </div>
                            <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.next_appointment')}</p>
                            <div className="relative z-10">
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors mb-1`}>
                                    {new Date(nextBooking.booking_date).toLocaleDateString(i18n.language === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'short' })}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                    {nextBooking.booking_time.slice(0, 5)} - {nextBooking.vehicle_plate}
                                </p>
                            </div>
                        </motion.div>
                    ) : totalSpend > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                            className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 relative overflow-hidden group transition-colors`}
                        >
                            <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-10 group-hover:opacity-20 text-white' : 'opacity-5 group-hover:opacity-10 text-gray-900'}`}>
                                <Shield size={80} strokeWidth={2.5} />
                            </div>
                            <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-sm font-medium mb-1 transition-colors`}>{t('dashboard.total_spend')}</p>
                            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>
                                {formatCurrency(totalSpend)}
                            </h3>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                            className={`${isDarkMode ? 'bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 hover:border-accent/40' : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-xl hover:shadow-blue-600/20'} border rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-colors`}
                            onClick={() => navigate(getLocalizedPath('/reserva'))}
                        >
                            <div className={`absolute top-0 right-0 p-4 transition-opacity ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-20 group-hover:opacity-30 text-white'}`}>
                                <Plus size={80} />
                            </div>
                            <div className="h-full flex flex-col justify-center relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-1">{t('dashboard.new_booking')}</h3>
                                <p className={`${isDarkMode ? 'text-white/60' : 'text-blue-100'} text-sm transition-colors`}>{t('dashboard.book_now_hint')}</p>
                            </div>
                        </motion.div>
                    )}
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
                                        {t('dashboard.add_first_vehicle', 'Añadir Primer Vehículo')}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicles.map((vehicle) => (
                                        <motion.div
                                            key={vehicle.id}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedVehicle(vehicle)}
                                            className={`group cursor-pointer ${isDarkMode ? 'bg-[#111] border-white/10 hover:bg-white/5 hover:border-white/20' : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'} border rounded-3xl p-5 transition-all duration-300 relative overflow-hidden`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Imagen pequeña */}
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center p-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                    <img
                                                        src={getVehicleImage(vehicle.vehicle_type)}
                                                        alt={vehicle.vehicle_type}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight truncate`}>
                                                            {vehicle.plate}
                                                        </h3>
                                                        {vehicle.is_primary && (
                                                            <span className={`flex-shrink-0 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'} text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase`}>
                                                                {t('dashboard.primary_short', 'P')}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {(vehicle.brand || vehicle.model) ? (
                                                        <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} text-sm capitalize truncate`}>
                                                            {vehicle.brand} {vehicle.model}
                                                        </p>
                                                    ) : (
                                                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-400'} text-xs italic`}>
                                                            {t('dashboard.no_details')}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Chevron indicando click */}
                                                <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                                                    <Edit2 size={16} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Botón "Añadir" como tarjeta compacta al final */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowAddVehicle(true)}
                                        className={`flex items-center justify-center gap-3 p-5 rounded-3xl border-2 border-dashed transition-all ${isDarkMode ? 'border-white/10 hover:border-white/30 hover:bg-white/5 text-white/40 hover:text-white' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-400 hover:text-blue-600'}`}
                                    >
                                        <Plus size={20} />
                                        <span className="font-medium">{t('dashboard.add_vehicle')}</span>
                                    </motion.button>
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
                            className="h-full flex flex-col"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2 transition-colors`}>
                                    <Clock className={isDarkMode ? 'text-accent' : 'text-blue-600'} size={24} strokeWidth={2.5} />
                                    {t('dashboard.service_history')}
                                </h2>

                                {/* Filters */}
                                <div className="flex flex-col items-end gap-3">
                                    {/* Custom Vehicle Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white hover:border-white/30' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 shadow-sm'}`}
                                        >
                                            <span>{vehicleFilter === 'all' ? t('dashboard.all_vehicles') : vehicleFilter}</span>
                                            <ChevronDown size={16} className={`transition-transform ${isVehicleDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isVehicleDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setIsVehicleDropdownOpen(false)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                        className={`absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}
                                                    >
                                                        <button
                                                            onClick={() => { setVehicleFilter('all'); setIsVehicleDropdownOpen(false) }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${vehicleFilter === 'all' ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600') : (isDarkMode ? 'text-white/60 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}`}
                                                        >
                                                            <Car size={14} />
                                                            {t('dashboard.all_vehicles')}
                                                        </button>
                                                        {vehicles.map(v => (
                                                            <button
                                                                key={v.id}
                                                                onClick={() => { setVehicleFilter(v.plate); setIsVehicleDropdownOpen(false) }}
                                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${vehicleFilter === v.plate ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600') : (isDarkMode ? 'text-white/60 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}`}
                                                            >
                                                                {v.plate}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Segmented Control */}
                                    <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-100/50 border-gray-200'}`}>
                                        {[
                                            { id: 'all', label: t('dashboard.filter_all') },
                                            { id: 'active', label: t('dashboard.filter_active') },
                                            { id: 'completed', label: t('dashboard.filter_completed') }
                                        ].map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setStatusFilter(filter.id)}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === filter.id
                                                    ? (isDarkMode ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white text-blue-600 shadow-md shadow-blue-900/5')
                                                    : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className={`flex-1 flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-12 text-center border-dashed transition-colors min-h-[300px]`}>
                                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'} rounded-full flex items-center justify-center mb-4 transition-colors`}>
                                        <Calendar size={32} strokeWidth={2.5} className={isDarkMode ? 'text-white/40' : 'text-gray-400'} />
                                    </div>
                                    <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} font-medium transition-colors`}>{t('dashboard.no_bookings')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredBookings.slice(0, showAllHistory ? undefined : 5).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className={`${isDarkMode ? 'bg-[#111] border-white/10 hover:bg-white/5' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-md'} border rounded-2xl p-4 transition-all group`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm transition-colors`}>{booking.service?.name}</h4>
                                                    <Tooltip content={`${new Date(booking.booking_date + 'T00:00:00').toLocaleDateString()} • ${booking.booking_time}`} position="top">
                                                        <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-500'} text-xs transition-colors cursor-help`}>
                                                            {new Date(booking.booking_date + 'T00:00:00').toLocaleDateString(i18n.language === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </Tooltip>
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
                                    {filteredBookings.length > 5 && (
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
            </div >
            {/* Modals */}
            < AnimatePresence >
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
                    isDarkMode={isDarkMode}
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
                    isDarkMode={isDarkMode}
                />

                <VehicleDetailsModal
                    isOpen={!!selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                    vehicle={selectedVehicle}
                    onEdit={handleEditVehicle}
                    onUpdate={handleUpdateVehicle}
                    onDelete={(v) => handleDeleteVehicle(v.id, v.plate)}
                    onBook={(v) => navigate(getLocalizedPath('/reserva'), { state: { selectedVehicle: v } })}
                    bookings={bookings}
                    isDarkMode={isDarkMode}
                />
            </AnimatePresence >
        </div >
    )
}

// Modal de ConfirmaciÃ³n GenÃ©rico
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, cancelText, confirmText }) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
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



const AddVehicleModal = ({ isOpen, onClose, onSuccess, vehicleToEdit, isDarkMode }) => {
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-6 md:p-8 max-w-md w-full`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {vehicleToEdit ? t('dashboard.edit_vehicle_title', 'Editar Vehículo') : t('dashboard.add_vehicle_modal.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-500'} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* ... form fields ... */}
                    {/* Tipo de vehículo */}
                    <div>
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.type_label')}</label>
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
                                            ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                                            : (isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
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
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                            {t('dashboard.add_vehicle_modal.plate_label')}
                            <span className="text-xs ml-2">
                                ({vehicleType === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                            </span>
                        </label>
                        <input
                            type="text"
                            {...register('plate')}
                            onChange={(e) => setValue('plate', formatPlate(e.target.value))}
                            className={`w-full border rounded-xl p-3 focus:outline-none transition-colors uppercase 
                                ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'}
                                ${errors.plate
                                    ? 'border-red-500 focus:border-red-500'
                                    : (isDarkMode ? 'border-white/10 focus:border-white/50' : 'border-gray-200 focus:border-gray-400')
                                }`}
                            placeholder={vehicleType === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                            maxLength={7}
                        />
                        {errors.plate && (
                            <p className="text-red-500 text-xs mt-1">{t('dashboard.add_vehicle_modal.plate_error')}</p>
                        )}
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.nickname_label')}</label>
                        <input
                            type="text"
                            {...register('nickname')}
                            className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                ${isDarkMode
                                    ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                }`}
                            placeholder={t('dashboard.add_vehicle_modal.nickname_placeholder')}
                        />
                    </div>

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.brand_label')}</label>
                            <input
                                type="text"
                                {...register('brand')}
                                className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                    ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                    }`}
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.model_label')}</label>
                            <input
                                type="text"
                                {...register('model')}
                                className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                    ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                    }`}
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
                        className={`w-full font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${isDarkMode
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
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
const DeleteVehicleModal = ({ isOpen, onClose, onConfirm, plate, isDarkMode }) => {
    const { t } = useTranslation()

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-6 md:p-8 max-w-md w-full text-center`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <AlertCircle size={32} className="text-red-500" />
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.delete_vehicle_title')}</h2>
                <p className={`mb-8 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {t('dashboard.delete_vehicle_confirm', { plate })}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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