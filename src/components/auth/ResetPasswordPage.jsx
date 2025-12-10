import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'
import Header from '../layout/Header'

import SEO from '../ui/SEO'

import '../JetonHeader.css'
import { useMenu } from '../../hooks/useMenu'

const ResetPasswordPage = () => {
    const { t, i18n } = useTranslation()
    const { navigateWithTransition, getLocalizedPath } = useMenu()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isLinkInvalid, setIsLinkInvalid] = useState(false)

    const resetPasswordSchema = z.object({
        password: z.string().min(6, t('auth.errors.password_length')),
        confirmPassword: z.string().min(6, t('auth.errors.required'))
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.errors.password_mismatch'),
        path: ["confirmPassword"],
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' }
    })

    useEffect(() => {
        // 1. Check for errors in the URL (Hash)
        const hash = location.hash
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)) // remove '#'
            const errorDescription = params.get('error_description')
            const errorCode = params.get('error_code')

            if (errorCode || errorDescription) {
                // Ignore the raw errorDescription from Supabase (which is in English) 
                // and always use our translated message for a better user experience.
                const errorMsg = t('auth.errors.invalid_link', 'Enlace inválido o expirado')
                setError(errorMsg)
                setIsLinkInvalid(true)
                return;
            }
        }

        // 2. Check session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If explicit error handled above, we don't need to do much here.
            }
        })
    }, [location])

    const onSubmit = async (data) => {
        const { password } = data
        setError(null)
        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            setSuccess(true)
            setTimeout(() => {
                navigateWithTransition(getLocalizedPath('/login'))
            }, 2000)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
            <SEO title={t('auth.reset_password_title', 'Restablecer Contraseña')} />
            {/* Navbar Structure */}
            <Header alwaysVisible={true} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-20"
            >
                {isLinkInvalid ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="backdrop-blur-xl bg-black/40 border-2 border-red-500/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(239,68,68,0.25)] relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[300px] hover:shadow-[0_0_70px_-12px_rgba(239,68,68,0.4)] transition-shadow duration-500"
                    >
                        {/* Decorative gradient blob for error state - Pulsing */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-500/20 rounded-full blur-[60px] pointer-events-none"
                        />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <motion.div
                                    animate={{
                                        boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 10px rgba(239, 68, 68, 0.1)", "0 0 0 20px rgba(239, 68, 68, 0)"]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-2 relative"
                                >
                                    <AlertCircle className="text-red-400" size={40} />
                                </motion.div>
                            </motion.div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-display font-semibold text-white">{t('auth.errors.error_title', 'Enlace Expirado')}</h3>
                                <p className="text-red-300 text-lg font-medium">{error}</p>
                            </div>

                            <Link
                                to={getLocalizedPath('/forgot-password')}
                                className="mt-4 px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/10 hover:shadow-red-500/20"
                            >
                                {t('auth.request_new_link', 'Solicitar nuevo enlace')}
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    /* Glass Card */
                    <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            {!success ? (
                                <>
                                    <div className="text-center mb-10">
                                        <h1 className="text-3xl font-display font-semibold text-white mb-2">{t('auth.new_password_title')}</h1>
                                        <p className="text-white/60">{t('auth.new_password_subtitle')}</p>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-start gap-3 mb-6"
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                                                <p className="text-red-200 text-sm">{error}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80 ml-1">{t('auth.password')}</label>
                                            <div className="relative group">
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                                                    <Lock size={20} />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register('password')}
                                                    className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${errors.password
                                                        ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                                                        : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                                                        }`}
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none z-10"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                {errors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-red-400 text-xs pr-2"
                                                    >
                                                        {errors.password.message}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80 ml-1">{t('auth.confirm_password')}</label>
                                            <div className="relative group">
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.confirmPassword ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                                                    <Lock size={20} />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register('confirmPassword')}
                                                    className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${errors.confirmPassword
                                                        ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                                                        : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                                                        }`}
                                                    placeholder="••••••••"
                                                />
                                                {errors.confirmPassword && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-xs"
                                                    >
                                                        {errors.confirmPassword.message}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? t('auth.updating') : t('auth.update_password_button')}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="mx-auto w-16 h-16 mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                                    >
                                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="text-2xl font-display font-semibold text-white mb-2"
                                    >
                                        {t('auth.password_updated_title')}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-white/60"
                                    >
                                        {t('auth.redirecting_login')}
                                    </motion.p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default ResetPasswordPage
