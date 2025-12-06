import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const ReviewModal = ({ isOpen, onClose, booking, onSuccess, isDarkMode }) => {
    const { t } = useTranslation()
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [isPublic, setIsPublic] = useState(false)

    if (!isOpen || !booking) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('testimonials')
                .insert({
                    booking_id: booking.id,
                    name: booking.client_name,
                    content: comment,
                    rating: rating,
                    role: booking.vehicle_plate, // Save plate as role
                    is_public: isPublic
                })

            if (error) throw error

            toast.success(t('dashboard.review_success', '¡Gracias por tu reseña!'))
            onSuccess()
            onClose()
            setComment('')
            setRating(5)
        } catch (error) {
            console.error('Error submitting review:', error)
            toast.error(t('dashboard.review_error', 'Error al enviar la reseña'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#111] border border-white/10' : 'bg-white'}`}
            >
                {/* Header */}
                <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('dashboard.write_review', 'Escribir Reseña')}
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Info */}
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {booking.service?.name}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                            {new Date(booking.booking_date).toLocaleDateString()} • {booking.vehicle_plate}
                        </p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex flex-col items-center gap-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                            {t('dashboard.rate_service', 'Califica el servicio')}
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        fill={(hoveredStar || rating) >= star ? "#EAB308" : "none"}
                                        className={(hoveredStar || rating) >= star ? "text-yellow-500" : isDarkMode ? "text-white/20" : "text-gray-300"}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                            {t('dashboard.your_comment', 'Tu comentario')}
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={4}
                            placeholder={t('dashboard.comment_placeholder', 'Cuéntanos tu experiencia...')}
                            className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${isDarkMode
                                ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border'
                                }`}
                        />
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            {t('dashboard.public_review_toggle', 'Hacer pública mi reseña')}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDarkMode
                                ? 'bg-white/5 text-white hover:bg-white/10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {t('common.cancel', 'Cancelar')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/25 ${loading
                                ? 'bg-blue-600/50 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    {t('common.sending', 'Enviando...')}
                                </span>
                            ) : (
                                t('dashboard.submit_review', 'Enviar Reseña')
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default ReviewModal
