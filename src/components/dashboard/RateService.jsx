import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'
import { motion } from 'framer-motion'
import { Star, Car, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AnimatedButton from '../ui/AnimatedButton'
import SEO from '../ui/SEO'
import RateServiceSkeleton from './RateServiceSkeleton'

const RateService = () => {
    const { bookingId } = useParams()
    const navigate = useNavigate()
    const { navigateWithTransition, getLocalizedPath } = useMenu()
    const { t, i18n } = useTranslation()
    const { isDarkMode } = useOutletContext() // Get theme from layout
    const [booking, setBooking] = useState(null)
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const justSubmitted = useRef(false)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, service:services(*)')
                    .eq('id', bookingId)
                    .single()

                if (error) throw error

                if (!data) {
                    toast.error(t('dashboard.rate_service_page.booking_not_found'))
                    navigateWithTransition(getLocalizedPath('/dashboard'))
                    return
                }

                if (data.is_rated && !justSubmitted.current) {
                    toast.info(t('dashboard.rate_service_page.already_rated'))
                    navigateWithTransition(getLocalizedPath('/dashboard'))
                    return
                }

                setBooking(data)

                // Fetch vehicle details
                if (data.vehicle_plate) {
                    const { data: vehicleData } = await supabase
                        .from('user_vehicles')
                        .select('*')
                        .eq('plate', data.vehicle_plate)
                        .single()

                    if (vehicleData) {
                        setVehicle(vehicleData)
                    }
                }

            } catch (error) {
                console.error('Error fetching booking:', error)
                toast.error(t('dashboard.rate_service_page.load_error'))
                navigateWithTransition(getLocalizedPath('/dashboard'))
            } finally {
                setLoading(false)
            }
        }

        fetchBooking()
    }, [bookingId, navigate, t])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error(t('dashboard.rate_service_page.select_rating_error'))
            return
        }

        setSubmitting(true)
        justSubmitted.current = true

        try {
            const rawName = booking.client_name ? booking.client_name.split(' ')[0] : t('dashboard.rate_service_page.default_client_name')
            const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()

            let role = ''
            if (vehicle && (vehicle.brand || vehicle.model)) {
                role = `${t('dashboard.rate_service_page.owner_of')} ${vehicle.brand || ''} ${vehicle.model || ''}`.trim()
            }

            // 1. Insert testimonial
            const { error: testimonialError } = await supabase
                .from('testimonials')
                .insert({
                    booking_id: booking.id,
                    name: name,
                    role: role,
                    content: comment,
                    rating: rating,
                    is_public: isPublic
                })

            if (testimonialError) throw testimonialError

            // 2. Update booking as rated
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ is_rated: true })
                .eq('id', booking.id)

            if (bookingError) throw bookingError

            toast.success(t('dashboard.rate_service_page.success_message'))
            navigateWithTransition(getLocalizedPath('/dashboard'))

        } catch (error) {
            console.error('Error submitting review:', error)
            toast.error(t('dashboard.rate_service_page.error_message'))
            justSubmitted.current = false
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <RateServiceSkeleton isDarkMode={isDarkMode} />
    }

    return (
        <div className="pb-20 px-4 md:px-8 lg:pt-20 max-w-2xl mx-auto w-full">
            <SEO title={t('dashboard.rate_service_page.seo_title')} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className={`text-3xl font-display font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('dashboard.rate_service_page.title_part1')} <span className="text-accent">{t('dashboard.rate_service_page.title_part2')}</span>
                </h1>
                <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    {t('dashboard.rate_service_page.subtitle')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-8 transition-colors`}
            >
                {/* Booking Summary */}
                <div className={`flex items-center gap-6 mb-8 pb-8 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <Car className={isDarkMode ? 'text-white/60' : 'text-gray-500'} size={32} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.service?.name}</h3>
                        <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(booking.booking_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Car size={14} />
                                {booking.vehicle_plate}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Rating */}
                    <div className="text-center">
                        <label className={`block text-sm font-medium mb-4 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                            {t('dashboard.rate_service_page.general_rating')}
                        </label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        size={40}
                                        className={`transition-colors ${star <= (hoverRating || rating)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : isDarkMode ? 'text-white/20' : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                            {rating === 5
                                ? t('dashboard.rate_service_page.comment_label_5')
                                : rating > 0
                                    ? t('dashboard.rate_service_page.comment_label_bad')
                                    : t('dashboard.rate_service_page.comment_label_default')
                            }
                        </label>
                        <div className="relative">
                            <textarea
                                id="comment"
                                rows={4}
                                maxLength={300}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={rating === 5 ? t('dashboard.rate_service_page.comment_placeholder_5') : t('dashboard.rate_service_page.comment_placeholder_default')}
                                className={`w-full rounded-xl p-4 focus:outline-none focus:border-accent transition-colors resize-none border ${isDarkMode
                                    ? 'bg-black/20 border-white/10 text-white placeholder:text-white/20'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                                    }`}
                            />
                            <div className={`absolute bottom-2 right-2 text-xs ${comment.length >= 300
                                ? 'text-red-500'
                                : isDarkMode ? 'text-white/40' : 'text-gray-400'
                                }`}>
                                {comment.length}/300
                            </div>
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode
                        ? 'bg-white/5 border-white/10'
                        : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPublic
                                ? 'bg-accent'
                                : isDarkMode ? 'bg-white/20' : 'bg-gray-300'
                                }`}
                        >
                            <motion.div
                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                                animate={{ x: isPublic ? 24 : 0 }}
                            />
                        </div>
                        <span className={`text-sm cursor-pointer ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`} onClick={() => setIsPublic(!isPublic)}>
                            {t('dashboard.rate_service_page.public_toggle')}
                        </span>
                    </div>

                    <AnimatedButton
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="w-full !flex !items-center !justify-center"
                        variant={isDarkMode ? 'primary' : 'accent'}
                    >
                        <span className="flex items-center justify-center gap-2 w-full">
                            {submitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <CheckCircle size={20} />
                            )}
                            <span>{submitting ? t('dashboard.rate_service_page.submitting') : t('dashboard.rate_service_page.submit_button')}</span>
                        </span>
                    </AnimatedButton>
                </form>
            </motion.div>
        </div>
    )
}

export default RateService
