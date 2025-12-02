import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Star, Trash2, Eye, EyeOff, Search, Loader2 } from 'lucide-react'
import Tooltip from '../ui/Tooltip'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'


const AdminReviews = ({ isDarkMode }) => {
    const { t } = useTranslation()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

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

    const filteredReviews = reviews.filter(review =>
        review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.booking?.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`} size={20} />
                    <input
                        type="text"
                        placeholder={t('admin.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none border ${isDarkMode
                            ? 'bg-white/5 border-white/10 text-white focus:border-white/30'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300 shadow-sm'
                            }`}
                    />
                </div>
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}>
                    {t('admin.total')}: {filteredReviews.length}
                </div>
            </div>

            {/* Reviews List */}
            <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.user')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.rating')}</th>
                                <th className={`p-4 font-medium text-sm ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('admin.comment')}</th>
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
                                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>{new Date(review.created_at).toLocaleDateString()}</div>
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
