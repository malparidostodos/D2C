import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import {
    Calendar, Clock, CheckCircle, XCircle, AlertCircle,
    Search, Filter, ChevronDown, MoreHorizontal,
    DollarSign, Users, TrendingUp, Car
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StatusDropdown from './StatusDropdown'

import SEO from '../ui/SEO'

const AdminDashboard = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [verifyingAdmin, setVerifyingAdmin] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        completedBookings: 0
    })

    useEffect(() => {
        const init = async () => {
            const isAllowed = await checkAdmin()
            if (isAllowed) {
                setVerifyingAdmin(false)
                fetchBookings()

                // Suscripción a cambios en tiempo real
                const channels = supabase.channel('admin-bookings-channel')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'bookings' },
                        (payload) => {
                            console.log('Admin realtime update:', payload)
                            fetchBookings()
                        }
                    )
                    .subscribe()

                return () => {
                    supabase.removeChannel(channels)
                }
            }
        }
        init()
    }, [])

    const checkAdmin = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return false
            }

            // Verificar si es admin usando la función segura de base de datos
            const { data: isAdmin, error } = await supabase.rpc('is_admin')

            if (error || !isAdmin) {
                console.warn('Acceso denegado: Usuario no es administrador')
                navigate('/') // Redirigir al home o dashboard de usuario
                return false
            }
            return true
        } catch (e) {
            navigate('/')
            return false
        }
    }

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.rpc('get_admin_bookings')

            if (error) {
                console.error('RPC Error:', error)
                throw error
            }

            console.log('Admin bookings fetched:', data)
            setBookings(data || [])
            calculateStats(data || [])

        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (data) => {
        const stats = data.reduce((acc, curr) => {
            acc.totalBookings++
            acc.totalRevenue += curr.total_price || 0
            if (curr.status === 'pending') acc.pendingBookings++
            if (curr.status === 'completed') acc.completedBookings++
            return acc
        }, {
            totalBookings: 0,
            totalRevenue: 0,
            pendingBookings: 0,
            completedBookings: 0
        })
        setStats(stats)
    }

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            const { error } = await supabase.rpc('admin_update_booking_status', {
                p_booking_id: bookingId,
                p_status: newStatus
            })

            if (error) throw error

            // Actualizar estado local
            setBookings(bookings.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ))

            // Recalcular stats
            calculateStats(bookings.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ))

        } catch (error) {
            console.error('Error updating status:', error)
            alert('Error al actualizar el estado')
        }
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter

        if (searchTerm === '') return matchesFilter

        const matchesSearch =
            booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id?.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesFilter && matchesSearch
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500'
            case 'confirmed': return 'bg-blue-500/20 text-blue-500'
            case 'in_progress': return 'bg-purple-500/20 text-purple-500'
            case 'completed': return 'bg-green-500/20 text-green-500'
            case 'cancelled': return 'bg-red-500/20 text-red-500'
            default: return 'bg-gray-500/20 text-gray-500'
        }
    }

    if (verifyingAdmin) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white/60">Verificando acceso...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <SEO title="Admin Dashboard" />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
                        <p className="text-white/60">Gestiona tus reservas y clientes</p>
                    </div>
                    <button
                        onClick={fetchBookings}
                        className="w-full md:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Actualizar
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Ingresos Totales"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="text-green-500" />}
                    />
                    <StatCard
                        title="Reservas Totales"
                        value={stats.totalBookings}
                        icon={<Calendar className="text-blue-500" />}
                    />
                    <StatCard
                        title="Pendientes"
                        value={stats.pendingBookings}
                        icon={<Clock className="text-yellow-500" />}
                    />
                    <StatCard
                        title="Completadas"
                        value={stats.completedBookings}
                        icon={<CheckCircle className="text-purple-500" />}
                    />
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o placa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/30"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${filter === status
                                    ? 'bg-white text-black font-medium'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {status === 'all' ? 'Todos' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List - Responsive */}
                <div className="bg-transparent md:bg-white/5 md:border md:border-white/10 rounded-2xl overflow-hidden">

                    {/* Mobile View (Cards) */}
                    <div className="md:hidden space-y-4">
                        {loading ? (
                            <div className="text-center text-white/40 py-8">Cargando reservas...</div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="text-center text-white/40 py-8">No se encontraron reservas</div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div key={booking.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{booking.client_name}</h3>
                                            <p className="text-white/40 text-sm">{booking.client_email}</p>
                                        </div>
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-white">
                                            {booking.vehicle_plate}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-white/40 mb-1">Servicio</p>
                                            <p className="text-white">{booking.service_name || booking.service?.name || 'Servicio'}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 mb-1">Fecha</p>
                                            <p className="text-white">{booking.booking_date} {booking.booking_time}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 mb-1">Precio</p>
                                            <p className="text-white font-bold">${booking.total_price?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 mb-1">Estado</p>
                                            <StatusDropdown
                                                currentStatus={booking.status}
                                                onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                                                getStatusColor={getStatusColor}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-white/60 font-medium text-sm">Cliente</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Vehículo</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Servicio</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Fecha</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Estado</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Precio</th>
                                    <th className="p-4 text-white/60 font-medium text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-white/40">
                                            Cargando reservas...
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-white/40">
                                            No se encontraron reservas
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{booking.client_name}</div>
                                                <div className="text-sm text-white/40">{booking.client_email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-white">
                                                        {booking.vehicle_plate}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-white/80">
                                                {booking.service_name || booking.service?.name || 'Servicio'}
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white">{booking.booking_date}</div>
                                                <div className="text-sm text-white/40">{booking.booking_time}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white font-medium">
                                                ${booking.total_price?.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <StatusDropdown
                                                        currentStatus={booking.status}
                                                        onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                                                        getStatusColor={getStatusColor}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-white/60 text-sm font-medium">{title}</h3>
            <div className="p-2 bg-white/5 rounded-lg">
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
)

export default AdminDashboard
