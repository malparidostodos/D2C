import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'

import SEO from '../ui/SEO'

import '../JetonHeader.css'

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Required").email("Invalid email")
})

const ForgotPasswordPage = () => {
    const { t, i18n } = useTranslation()
    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' }
    })
    const navigate = useNavigate()

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    const onSubmit = async (data) => {
        const { email } = data
        try {
            // Invocar la Edge Function para enviar el correo personalizado
            const { error } = await supabase.functions.invoke('send-password-reset-email', {
                body: { email }
            })

            if (error) throw error

            setSubmitted(true)
        } catch (error) {
            console.error('Error sending reset password email:', error)
            toast.error(t('auth.error_sending_email'))
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
            <SEO title={t('auth.forgot_password_title', 'Recuperar Contraseña')} />
            {/* Navbar Structure for Logo */}
            <div className="_navbar">
                <div className="nav-container flex justify-between items-center">
                    <Link
                        to={getLocalizedPath('/')}
                        className="text-3xl font-display font-bold text-black tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        Ta' <span className="text-accent">To'</span> Clean
                    </Link>
                    <LanguageSelector />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-20"
            >
                {/* Glass Card */}
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">{t('auth.forgot_password_title')}</h1>
                            {!submitted ? (
                                <p className="text-white/60">
                                    {t('auth.forgot_password_subtitle')}
                                </p>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                        className="flex items-center justify-center gap-3 mb-2"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="text-lg font-semibold text-green-100 mb-1"
                                    >
                                        {t('auth.email_sent_title')}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="text-green-200/90"
                                    >
                                        {t('auth.email_sent_message')}
                                    </motion.p>
                                </motion.div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">{t('auth.email')}</label>
                                <div className="relative group">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                                            : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                                            }`}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-xs"
                                        >
                                            {errors.email.message}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('auth.send_link_button')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                {t('auth.remembered_password')}{' '}
                                <Link to={getLocalizedPath('/login')} className="text-white font-medium hover:underline">
                                    {t('auth.login_here')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ForgotPasswordPage
