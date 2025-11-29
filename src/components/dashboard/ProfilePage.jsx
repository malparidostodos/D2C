import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'

import SEO from '../ui/SEO'

const nameSchema = z.object({
    fullName: z.string().min(1, "Required")
})

const emailSchema = z.object({
    email: z.string().email("Invalid email")
})

const passwordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Required")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

const ProfilePage = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Forms
    const { register: registerName, handleSubmit: handleSubmitName, setValue: setValueName, formState: { errors: errorsName, isSubmitting: isSubmittingName } } = useForm({
        resolver: zodResolver(nameSchema)
    })

    const { register: registerEmail, handleSubmit: handleSubmitEmail, setValue: setValueEmail, formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail } } = useForm({
        resolver: zodResolver(emailSchema)
    })

    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword } } = useForm({
        resolver: zodResolver(passwordSchema)
    })

    // UI states
    const [isAdmin, setIsAdmin] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate(getLocalizedPath('/login'))
            return
        }
        setUser(session.user)
        setValueName('fullName', session.user.user_metadata?.full_name || '')
        setValueEmail('email', session.user.email || '')

        // Check if admin
        const { data: adminStatus } = await supabase.rpc('is_admin')
        setIsAdmin(!!adminStatus)

        setLoading(false)
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const onUpdateName = async (data) => {
        if (isAdmin) return
        const { fullName } = data

        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.name_updated'))
            checkUser() // Refresh user data
        }
    }

    const onUpdateEmail = async (data) => {
        if (isAdmin) return
        const { email } = data

        const { error } = await supabase.auth.updateUser({
            email: email
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.email_updated'))
        }
    }

    const onUpdatePassword = async (data) => {
        const { newPassword } = data

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.password_updated'))
            resetPassword()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-xl">{t('common.loading')}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8">
            <SEO title={t('profile.title', 'Mi Perfil')} />
            <Link to={getLocalizedPath('/')} className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl font-display font-bold text-white tracking-tighter z-50 hover:opacity-80 transition-opacity">
                Ta' <span className="text-accent">To'</span> Clean
            </Link>

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        to={getLocalizedPath('/dashboard')}
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        {t('profile.back_to_dashboard')}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        {t('profile.title')}
                    </h1>
                    <p className="text-white/60">{t('profile.subtitle')}</p>
                </motion.div>

                {/* Message Toast */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-500'
                            : 'bg-red-500/10 border-red-500/30 text-red-500'
                            }`}
                    >
                        {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <span>{message.text}</span>
                    </motion.div>
                )}

                {/* Update Name */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-full">
                            <User size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{t('profile.full_name')}</h2>
                        {isAdmin && <span className="text-xs text-white/40 ml-auto bg-white/5 px-2 py-1 rounded">Admin Locked</span>}
                    </div>
                    <form onSubmit={handleSubmitName(onUpdateName)} className="space-y-4">
                        <input
                            type="text"
                            {...registerName('fullName')}
                            className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${isAdmin ? 'opacity-50 cursor-not-allowed border-white/10' : errorsName.fullName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                            placeholder={t('profile.full_name_placeholder')}
                            disabled={isAdmin}
                        />
                        {errorsName.fullName && <p className="text-red-500 text-sm">{errorsName.fullName.message}</p>}
                        <AnimatedButton
                            type="submit"
                            disabled={isSubmittingName || isAdmin}
                            className={`w-full ${isSubmittingName || isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmittingName ? t('profile.updating') : t('profile.update_name')}
                        </AnimatedButton>
                    </form>
                </motion.section>

                {/* Update Email */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-full">
                            <Mail size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{t('profile.email_address')}</h2>
                        {isAdmin && <span className="text-xs text-white/40 ml-auto bg-white/5 px-2 py-1 rounded">Admin Locked</span>}
                    </div>
                    <form onSubmit={handleSubmitEmail(onUpdateEmail)} className="space-y-4">
                        <input
                            type="email"
                            {...registerEmail('email')}
                            className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${isAdmin ? 'opacity-50 cursor-not-allowed border-white/10' : errorsEmail.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                            placeholder={t('auth.mail')}
                            disabled={isAdmin}
                        />
                        {errorsEmail.email && <p className="text-red-500 text-sm">{errorsEmail.email.message}</p>}
                        <p className="text-white/40 text-sm">{t('profile.email_note')}</p>
                        <AnimatedButton
                            type="submit"
                            disabled={isSubmittingEmail || isAdmin}
                            className={`w-full ${isSubmittingEmail || isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmittingEmail ? t('profile.updating') : t('profile.update_email')}
                        </AnimatedButton>
                    </form>
                </motion.section>

                {/* Update Password */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-full">
                            <Lock size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{t('profile.change_password')}</h2>
                    </div>
                    <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
                        <input
                            type="password"
                            {...registerPassword('newPassword')}
                            className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${errorsPassword.newPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                            placeholder={t('profile.new_password')}
                        />
                        {errorsPassword.newPassword && <p className="text-red-500 text-sm">{errorsPassword.newPassword.message}</p>}
                        <input
                            type="password"
                            {...registerPassword('confirmPassword')}
                            className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors ${errorsPassword.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white/50'}`}
                            placeholder={t('auth.confirm_password')}
                        />
                        {errorsPassword.confirmPassword && <p className="text-red-500 text-sm">{errorsPassword.confirmPassword.message}</p>}
                        <AnimatedButton
                            type="submit"
                            disabled={isSubmittingPassword}
                            className={`w-full ${isSubmittingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmittingPassword ? t('profile.updating') : t('profile.update_password')}
                        </AnimatedButton>
                    </form>
                </motion.section>
            </div>
        </div>
    )
}

export default ProfilePage
