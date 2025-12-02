import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useOutletContext } from 'react-router-dom'
import { Star, Calendar, MessageSquare, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import SEO from '../ui/SEO'
import Tooltip from '../ui/Tooltip'
import ConfirmationModal from '../ui/ConfirmationModal'
import UserReviewsSkeleton from './UserReviewsSkeleton'

const UserReviews = () => {
    const { t } = useTranslation()
    const { isDarkMode, user } = useOutletContext()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch testimonials linked to bookings made by this user
            const { data, error } = await supabase
                .from('testimonials')
                .select(`
                    *,
                    booking:bookings!inner(
                        user_id,
                        service:services(name),
                        vehicle_plate,
                        booking_date
                    )
                `)
                .eq('booking.user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReviews(data || [])
        } catch (error) {
            console.error('Error fetching reviews:', error)
            toast.error(t('dashboard.user_reviews_page.load_error'))
        } finally {
            setLoading(false)
        }
    }

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [reviewToDelete, setReviewToDelete] = useState(null)

    const confirmDelete = (id) => {
        setReviewToDelete(id)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!reviewToDelete) return

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', reviewToDelete)

            if (error) throw error

            setReviews(reviews.filter(r => r.id !== reviewToDelete))
            toast.success(t('dashboard.user_reviews_page.delete_success'))
        } catch (error) {
            console.error('Error deleting review:', error)
            toast.error(t('dashboard.user_reviews_page.delete_error'))
        } finally {
            setDeleteModalOpen(false)
            setReviewToDelete(null)
        }
    }

    if (loading) {
        return <UserReviewsSkeleton isDarkMode={isDarkMode} />
    }

    return (
        <div className={`pt-32 pb-20 px-4 md:px-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <SEO title={t('dashboard.user_reviews_page.seo_title')} />
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className={`text-3xl font-display font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('dashboard.user_reviews_page.title')}
                    </h1>
                    <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        {t('dashboard.user_reviews_page.subtitle')}
                    </p>
                </motion.div>

                {reviews.length === 0 ? (
                    <div className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-12 text-center border-dashed transition-colors`}>
                        <div className={`w-16 h-16 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <MessageSquare size={32} className={isDarkMode ? 'text-white/40' : 'text-gray-400'} />
                        </div>
                        <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.user_reviews_page.no_reviews')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200 shadow-sm'} border rounded-3xl p-6 relative group`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {review.booking?.service?.name}
                                        </h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`flex gap-1 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-500'}`}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < review.rating ? "currentColor" : "none"}
                                                className={i < review.rating ? "" : isDarkMode ? "text-white/20" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className={`mb-6 line-clamp-4 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
                                    "{review.content}"
                                </p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                                    <span className={`text-xs px-2 py-1 rounded-full ${review.is_public
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {review.is_public ? t('dashboard.user_reviews_page.public') : t('dashboard.user_reviews_page.private')}
                                    </span>

                                    <Tooltip content={t('dashboard.user_reviews_page.delete_tooltip')}>
                                        <button
                                            onClick={() => confirmDelete(review.id)}
                                            className={`p-2 rounded-full transition-colors ${isDarkMode
                                                ? 'hover:bg-red-500/20 text-white/40 hover:text-red-400'
                                                : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                                                }`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </Tooltip>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title={t('dashboard.user_reviews_page.delete_tooltip')}
                    message={t('dashboard.user_reviews_page.delete_confirm')}
                    confirmText={t('common.delete')}
                    cancelText={t('common.cancel')}
                    isDarkMode={isDarkMode}
                    variant="danger"
                />
            </div>
        </div>
    )
}

export default UserReviews
