import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Star, Trash2, Eye, EyeOff, Search, Loader2, Filter, Calendar, X, ChevronDown, Check } from 'lucide-react'
import Tooltip from '../ui/Tooltip'
import DatePicker from '../ui/DatePicker'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

// Custom Select Component
const CustomSelect = ({ value, onChange, options, icon: Icon, isDarkMode, label }) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(opt => opt.value === value)

    return (
        <div className="relative w-full md:w-auto" ref={containerRef}>
            {label && (
                <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {label}
                </label>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full md:min-w-[200px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${isDarkMode
                    ? `bg-[#111] border-white/10 text-white hover:bg-white/5 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`
                    : `bg-white border-gray-200 text-gray-900 hover:bg-gray-50 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}`
                    }`}
            >
                <div className="flex items-center gap-2 truncate">
                    {Icon && <Icon size={16} className={isDarkMode ? 'text-white/40' : 'text-gray-400'} />}
                    <span className="text-sm font-medium truncate">{selectedOption?.label}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-100'
                            }`}
                    >
                        <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${value === option.value
                                        ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                                        : (isDarkMode ? 'text-white/80 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50')
                                        }`}
                                >
                                    <span className="font-medium">{option.label}</span>
                                    {value === option.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const AdminReviews = ({ isDarkMode }) => {
    const { t } = useTranslation()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    // Sorting and Filtering State
    const [sortOrder, setSortOrder] = useState('recent')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select(`
                    *,
                    booking:bookings(
                        client_name,
                        client_email,
                        vehicle_plate,
                        booking_date,
                        service:services(name)
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReviews(data || [])
        } catch (error) {
            console.error('Error fetching reviews:', error)
            toast.error(t('admin.messages.load_reviews_error'))
        } finally {
            setLoading(false)
        }
    }

    const handleToggleVisibility = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_public: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setReviews(reviews.map(r =>
                r.id === id ? { ...r, is_public: !currentStatus } : r
            ))
            toast.success(!currentStatus ? t('admin.messages.review_now_visible') : t('admin.messages.review_now_hidden'))
        } catch (error) {
            toast.error(t('admin.toggle_visibility_error'))
        }
    }

    const handleDelete = async (id) => {
        if (!confirm(t('admin.messages.delete_review_confirm'))) return

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id)

            if (error) throw error

            setReviews(reviews.filter(r => r.id !== id))
            toast.success(t('admin.messages.review_deleted'))
        } catch (error) {
            toast.error(t('admin.delete_review_error'))
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSortOrder('recent')
        setStartDate('')
        setEndDate('')
    }

    const filteredReviews = reviews.filter(review => {
        // Search Filter
        const matchesSearch =
            review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.booking?.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.booking?.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase())

        // Date Filter
        let matchesDate = true
        if (startDate || endDate) {
            const reviewDate = new Date(review.created_at).setHours(0, 0, 0, 0)
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null
            const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null

            if (start && reviewDate < start) matchesDate = false
            if (end && reviewDate > end) matchesDate = false
        }

        return matchesSearch && matchesDate
    }).sort((a, b) => {
        switch (sortOrder) {
            case 'recent':
                return new Date(b.created_at) - new Date(a.created_at)
            case 'oldest':
                return new Date(a.created_at) - new Date(b.created_at)
            case 'rating_asc':
                return a.rating - b.rating
            case 'rating_desc':
                return b.rating - a.rating
            default:
                return 0
        }
    })

    const sortOptions = [
        { value: 'recent', label: t('admin.filters.sort_options.recent') },
        { value: 'oldest', label: t('admin.filters.sort_options.oldest') },
        { value: 'rating_desc', label: t('admin.filters.sort_options.rating_desc') },
        { value: 'rating_asc', label: t('admin.filters.sort_options.rating_asc') },
    ]

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4">
                {/* Top Row: Search & Total */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`} size={20} />

                        {/* Focus Indicator Line */}
                        <div
                            className={`absolute left-10 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-blue-500 transition-opacity duration-200 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`}
                        />

                        <input
                            type="text"
                            placeholder={t('admin.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none border transition-all duration-200 ${isDarkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-white/30 focus:bg-white/10'
                                : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 shadow-sm'
                                }`}
                        />
                    </div>
                    <div className={`px-4 py-2 rounded-lg flex items-center justify-center font-medium ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}>
                        {t('admin.total')}: {filteredReviews.length}
                    </div>
                </div>

                {/* Filters Row */}
                <div className={`p-5 rounded-2xl border transition-colors duration-200 ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50/50 border-gray-200'}`}>
                    <div className="flex flex-col lg:flex-row gap-6 items-end">
                        {/* Sort Dropdown */}
                        <CustomSelect
                            label={t('admin.filters.sort_by')}
                            value={sortOrder}
                            onChange={setSortOrder}
                            options={sortOptions}
                            icon={Filter}
                            isDarkMode={isDarkMode}
                        />

                        {/* Date Range */}
                        <div className="flex gap-4 w-full lg:w-auto flex-1">
                            <div className="flex-1">
                                <DatePicker
                                    label={t('admin.filters.start_date')}
                                    value={startDate}
                                    onChange={setStartDate}
                                    placeholder={t('admin.filters.start_date')}
                                    isDarkMode={isDarkMode}
                                    maxDate={new Date()}
                                />
                            </div>
                            <div className="flex-1">
                                <DatePicker
                                    label={t('admin.filters.end_date')}
                                    value={endDate}
                                    onChange={setEndDate}
                                    placeholder={t('admin.filters.end_date')}
                                    isDarkMode={isDarkMode}
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <AnimatePresence>
                            {(startDate || endDate || sortOrder !== 'recent' || searchTerm) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={clearFilters}
                                    className={`h-[42px] px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${isDarkMode
                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                        }`}
                                >
                                    <X size={16} />
                                    {t('admin.filters.clear_filters')}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.user')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.vehicle')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.rating')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.comment')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.table.date')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.status')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-200'}`}>
                            {filteredReviews.map((review) => (
                                <tr key={review.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4">
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{review.name}</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{review.booking?.client_email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {review.booking?.vehicle_plate || '-'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300 opacity-30"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className={`p-4 max-w-xs truncate ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`} title={review.content}>
                                        "{review.content}"
                                    </td>
                                    <td className="p-4">
                                        <div className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                                            {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${review.is_public
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {review.is_public ? t('admin.public') : t('admin.hidden')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Tooltip content={review.is_public ? t('admin.tooltips.hide') : t('admin.tooltips.make_public')}>
                                                <button
                                                    onClick={() => handleToggleVisibility(review.id, review.is_public)}
                                                    className={`p-2 rounded-full transition-colors ${review.is_public
                                                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                        : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                                                        }`}
                                                >
                                                    {review.is_public ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                            </Tooltip>

                                            <Tooltip content={t('admin.tooltips.delete')}>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className={`p-2 rounded-full transition-colors ${isDarkMode
                                                        ? 'hover:bg-red-500/20 text-white/40 hover:text-red-400'
                                                        : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                                                        }`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminReviews
