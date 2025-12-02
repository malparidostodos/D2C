import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
    Calendar, Clock, CheckCircle, XCircle, AlertCircle,
    Search, Filter, ChevronDown, MoreHorizontal,
    DollarSign, Users, TrendingUp, Car, ArrowLeft, ArrowUpDown, MessageSquare
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StatusDropdown from './StatusDropdown'
import AdminReviews from './AdminReviews'
import { toast } from 'sonner'

import SEO from '../ui/SEO'
import AdminDashboardSkeleton from './AdminDashboardSkeleton'

const AdminDashboard = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isDarkMode, isAdmin, isAdminLoading } = useOutletContext()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [minLoading, setMinLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setMinLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        completedBookings: 0
    })
    const [activeTab, setActiveTab] = useState('bookings')

    useEffect(() => {
        if (isAdminLoading) return

        if (!isAdmin) {
            navigate(-1)
            return
        }

        const init = async () => {
            fetchBookings()

            // Suscripción a cambios en tiempo real
            const channels = supabase.channel('admin-bookings-channel')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'bookings' },
                    (payload) => {
                        fetchBookings()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channels)
            }
        }
        init()
    }, [isAdmin, isAdminLoading])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.rpc('get_admin_bookings')

            if (error) {
                console.error('RPC Error:', error)
                throw error
            }

            // console.log('Admin bookings fetched:', data)
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
            toast.success(t('admin.messages.status_updated'))

        } catch (error) {
            console.error('Error updating status:', error)
            toast.error(t('admin.messages.status_update_error'))
        }
    }

    const [priceSort, setPriceSort] = useState('none') // 'none', 'asc', 'desc'
    const [dateSort, setDateSort] = useState('none') // 'none', 'asc', 'desc'

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter

        if (searchTerm === '') return matchesFilter

        const matchesSearch =
            booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id?.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesFilter && matchesSearch
    }).sort((a, b) => {
        // 1. Date Sort (Highest Priority if active)
        if (dateSort !== 'none') {
            const dateA = new Date(`${a.booking_date}T${a.booking_time}`)
            const dateB = new Date(`${b.booking_date}T${b.booking_time}`)
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA
        }

        // 2. Price Sort (High Priority if active)
        if (priceSort !== 'none') {
            const priceA = a.total_price || 0
            const priceB = b.total_price || 0
            return priceSort === 'asc' ? priceA - priceB : priceB - priceA
        }

        // 3. Default Priority Sort
        const getPriority = (s) => {
            switch (s) {
                case 'pending': return 1
                case 'confirmed': return 2
                case 'in_progress': return 3
                case 'completed': return 4
                case 'cancelled': return 5
                default: return 6
            }
        }

        const priorityA = getPriority(a.status)
        const priorityB = getPriority(b.status)

        if (priorityA !== priorityB) {
            return priorityA - priorityB
        }

        // 4. Default Date Sort (Secondary to Priority)
        const dateA = new Date(`${a.booking_date}T${a.booking_time}`)
        const dateB = new Date(`${b.booking_date}T${b.booking_time}`)

        if (['pending', 'confirmed', 'in_progress'].includes(a.status)) {
            return dateA - dateB
        }
        return dateB - dateA
    })

    const togglePriceSort = () => {
        setPriceSort(current => {
            if (current === 'none') return 'desc'
            if (current === 'desc') return 'asc'
            return 'none'
        })
        setDateSort('none') // Reset date sort when price sort is active
    }

    const toggleDateSort = () => {
        setDateSort(current => {
            if (current === 'none') return 'desc'
            if (current === 'desc') return 'asc'
            return 'none'
        })
        setPriceSort('none') // Reset price sort when date sort is active
    }

    const toggleStatusSort = () => {
        setPriceSort('none')
        setDateSort('none')
    }

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

    if (isAdminLoading) return null

    if (!isAdmin) return null

    if (loading || minLoading) {
        return <AdminDashboardSkeleton isDarkMode={isDarkMode} />
    }

    return (
        <div className={`pt-32 pb-20 px-4 md:px-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <SEO title="Admin Dashboard" />
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('admin.title')}</h1>
                        <p className={isDarkMode ? 'text-white/60' : 'text-gray-500'}>{t('admin.subtitle')}</p>
                    </div>
                    <button
                        onClick={fetchBookings}
                        className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                    >
                        {t('admin.update_button')}
                    </button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        title={t('admin.stats.total_revenue')}
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="text-green-500" />}
                        isDarkMode={isDarkMode}
                    />
                    <StatCard
                        title={t('admin.stats.total_bookings')}
                        value={stats.totalBookings}
                        icon={<Calendar className="text-blue-500" />}
                        isDarkMode={isDarkMode}
                    />
                    <StatCard
                        title={t('admin.stats.pending_bookings')}
                        value={stats.pendingBookings}
                        icon={<Clock className="text-yellow-500" />}
                        isDarkMode={isDarkMode}
                    />
                    <StatCard
                        title={t('admin.stats.completed_bookings')}
                        value={stats.completedBookings}
                        icon={<CheckCircle className="text-green-500" />}
                        isDarkMode={isDarkMode}
                    />
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'bookings'
                            ? (isDarkMode ? 'text-white' : 'text-gray-900')
                            : (isDarkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-500 hover:text-gray-700')
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            {t('admin.bookings')}
                        </div>
                        {activeTab === 'bookings' && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute bottom-0 left-0 w-full h-0.5 ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'reviews'
                            ? (isDarkMode ? 'text-white' : 'text-gray-900')
                            : (isDarkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-500 hover:text-gray-700')
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} />
                            {t('admin.reviews')}
                        </div>
                        {activeTab === 'reviews' && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute bottom-0 left-0 w-full h-0.5 ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
                            />
                        )}
                    </button>
                </div>

                {activeTab === 'reviews' ? (
                    <AdminReviews isDarkMode={isDarkMode} />
                ) : (
                    <>
                        {/* Filters & Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col md:flex-row gap-4 mb-6"
                        >
                            <div className="relative flex-1">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`} size={20} />

                                {/* Focus Indicator Line */}
                                <div
                                    className={`absolute left-11 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-blue-500 pointer-events-none transition-opacity duration-200 ${isSearchFocused && searchTerm === '' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
                                />

                                <input
                                    type="text"
                                    placeholder={t('admin.bookings_search_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none border ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-white/30'
                                        : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
                                        }`}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${filter === status
                                            ? (isDarkMode ? 'bg-white text-black font-medium' : 'bg-black text-white font-medium')
                                            : (isDarkMode ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                                            }`}
                                    >
                                        {status === 'all' ? t('admin.filters.all') : t(`dashboard.status.${status}`, status)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Bookings List - Responsive */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-transparent md:bg-white/5 md:border md:border-white/10' : 'bg-transparent md:bg-white md:border md:border-gray-200 md:shadow-sm'}`}
                        >

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden space-y-4">
                                {loading ? (
                                    <div className={`text-center py-8 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.messages.loading_bookings')}</div>
                                ) : filteredBookings.length === 0 ? (
                                    <div className={`text-center py-8 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.messages.no_bookings_found')}</div>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <div key={booking.id} className={`border rounded-xl p-5 space-y-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.client_name}</h3>
                                                    <p className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{booking.client_email}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                    {booking.vehicle_plate}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className={`mb-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.table.service')}</p>
                                                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{booking.service_name || booking.service?.name || 'Servicio'}</p>
                                                </div>
                                                <div>
                                                    <p className={`mb-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.table.date')}</p>
                                                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{booking.booking_date} {booking.booking_time}</p>
                                                </div>
                                                <div>
                                                    <p className={`mb-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.table.price')}</p>
                                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${booking.total_price?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className={`mb-1 ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t('admin.table.status')}</p>
                                                    <StatusDropdown
                                                        currentStatus={booking.status}
                                                        onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                                                        getStatusColor={getStatusColor}
                                                        isDarkMode={isDarkMode}
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
                                        <tr className={`border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.client')}</th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.vehicle')}</th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.service')}</th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                <button
                                                    onClick={toggleDateSort}
                                                    className={`flex items-center gap-1 transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
                                                >
                                                    {t('admin.table.date')}
                                                    <ArrowUpDown size={14} className={dateSort !== 'none' ? 'text-blue-500' : ''} />
                                                </button>
                                            </th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                <button
                                                    onClick={toggleStatusSort}
                                                    className={`flex items-center gap-1 transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
                                                >
                                                    {t('admin.table.status')}
                                                    <ArrowUpDown size={14} className={priceSort === 'none' && dateSort === 'none' ? 'text-blue-500' : ''} />
                                                </button>
                                            </th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                <button
                                                    onClick={togglePriceSort}
                                                    className={`flex items-center gap-1 transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
                                                >
                                                    {t('admin.table.price')}
                                                    <ArrowUpDown size={14} className={priceSort !== 'none' ? 'text-blue-500' : ''} />
                                                </button>
                                            </th>
                                            <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-200'}`}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className={`p-8 text-center ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                                    {t('admin.messages.loading_bookings')}
                                                </td>
                                            </tr>
                                        ) : filteredBookings.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className={`p-8 text-center ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                                    {t('admin.messages.no_bookings_found')}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBookings.map((booking) => (
                                                <tr key={booking.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                                                    <td className="p-4">
                                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.client_name}</div>
                                                        <div className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{booking.client_email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                                {booking.vehicle_plate}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className={`p-4 ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                        {booking.service_name || booking.service?.name || 'Servicio'}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>{booking.booking_date}</div>
                                                        <div className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{booking.booking_time}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {t(`dashboard.status.${booking.status}`, booking.status)}
                                                        </span>
                                                    </td>
                                                    <td className={`p-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        ${booking.total_price?.toLocaleString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <StatusDropdown
                                                                currentStatus={booking.status}
                                                                onStatusChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                                                                getStatusColor={getStatusColor}
                                                                isDarkMode={isDarkMode}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    )
}

const StatCard = ({ title, value, icon, isDarkMode }) => (
    <div className={`border rounded-2xl p-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-4">
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{title}</h3>
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                {icon}
            </div>
        </div>
        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
)

export default AdminDashboard
