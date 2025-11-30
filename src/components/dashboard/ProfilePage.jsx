import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Check, AlertCircle, Edit2 } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'


import SEO from '../ui/SEO'

const ProfilePage = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const nameSchema = z.object({
        fullName: z.string().min(1, t('common.required', "Required"))
    })

    const emailSchema = z.object({
        email: z.string().email(t('common.invalid_email', "Invalid email"))
    })

    const passwordSchema = z.object({
        newPassword: z.string().min(6, t('auth.password_length', "Password must be at least 6 characters")),
        confirmPassword: z.string().min(6, t('common.required', "Required"))
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t('auth.passwords_mismatch', "Passwords don't match"),
        path: ["confirmPassword"],
    })

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
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)

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
            setIsEditingName(false)
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
            setIsEditingEmail(false)
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
                <div className="text-white text-xl animate-pulse">{t('common.loading')}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
            <SEO title={t('profile.title', 'Mi Perfil')} />


            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pt-12 pb-12 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-[95%] mx-auto text-white">
                    <Link
                        to={getLocalizedPath('/dashboard')}
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        {t('profile.back_to_dashboard')}
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4">
                        {t('profile.title')}
                    </h1>
                    <p className="text-white/60 text-xl max-w-xl">
                        {t('profile.subtitle')}
                    </p>
                </div>
            </motion.div>

            {/* Main Content Card */}
            <div className="flex-grow px-2 sm:px-4 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="max-w-[95%] mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 min-h-[600px]"
                >
                    <div className="max-w-5xl mx-auto">

                        {/* Message Toast */}
                        <AnimatePresence>
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success'
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                        }`}
                                >
                                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                                    <span className="font-medium">{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avatar Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                            className="mb-12"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h3>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group">
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 w-full md:w-auto border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                                        <User size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Click here to upload your file or drag.</p>
                                    <p className="text-xs text-gray-500 mt-1">Supported Format: SVG, JPG, PNG (10mb each)</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8"
                        >
                            {/* Left Column */}
                            <div className="space-y-8">
                                {/* Name Form */}
                                <form onSubmit={handleSubmitName(onUpdateName)} className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">{t('profile.full_name')}</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            {...registerName('fullName')}
                                            disabled={isAdmin || !isEditingName}
                                            className={`w-full bg-white border rounded-xl py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsName.fullName ? 'border-red-500' : 'border-gray-200'} ${!isEditingName ? 'bg-gray-50 text-gray-500' : ''} ${isAdmin ? 'bg-gray-200/50 cursor-not-allowed opacity-100' : ''}`}
                                            placeholder={t('profile.full_name_placeholder')}
                                        />
                                        {!isAdmin ? (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                {isEditingName ? (
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmittingName}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title={t('common.save')}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setIsEditingName(true)
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" title="Edición bloqueada para administradores">
                                                <Lock size={18} />
                                            </div>
                                        )}
                                    </div>
                                    {errorsName.fullName && <p className="text-red-500 text-sm pl-1">{errorsName.fullName.message}</p>}
                                </form>

                                {/* Email Form */}
                                <form onSubmit={handleSubmitEmail(onUpdateEmail)} className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">{t('profile.email_address')}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            {...registerEmail('email')}
                                            disabled={isAdmin || !isEditingEmail}
                                            className={`w-full bg-white border rounded-xl py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsEmail.email ? 'border-red-500' : 'border-gray-200'} ${!isEditingEmail ? 'bg-gray-50 text-gray-500' : ''} ${isAdmin ? 'bg-gray-200/50 cursor-not-allowed opacity-100' : ''}`}
                                            placeholder={t('auth.mail')}
                                        />
                                        {!isAdmin ? (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                {isEditingEmail ? (
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmittingEmail}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title={t('common.save')}
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setIsEditingEmail(true)
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" title="Edición bloqueada para administradores">
                                                <Lock size={18} />
                                            </div>
                                        )}
                                    </div>
                                    {errorsEmail.email && <p className="text-red-500 text-sm pl-1">{errorsEmail.email.message}</p>}
                                    {!isAdmin && <p className="text-xs text-gray-500">{t('profile.email_note')}</p>}
                                </form>
                            </div>

                            {/* Right Column - Password */}
                            <div className="space-y-8">
                                <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900">{t('profile.change_password')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                {...registerPassword('newPassword')}
                                                className={`w-full bg-white border rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsPassword.newPassword ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder={t('profile.new_password')}
                                            />
                                        </div>
                                        {errorsPassword.newPassword && <p className="text-red-500 text-sm pl-1">{errorsPassword.newPassword.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900">{t('auth.confirm_password')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                {...registerPassword('confirmPassword')}
                                                className={`w-full bg-white border rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsPassword.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                                placeholder={t('auth.confirm_password')}
                                            />
                                        </div>
                                        {errorsPassword.confirmPassword && <p className="text-red-500 text-sm pl-1">{errorsPassword.confirmPassword.message}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingPassword}
                                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingPassword ? t('profile.updating') : t('profile.update_password')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ProfilePage
