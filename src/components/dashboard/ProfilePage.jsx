import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Check, AlertCircle, Edit2, Phone, ChevronDown, Shield } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import Tooltip from '../ui/Tooltip'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'


import SEO from '../ui/SEO'
import ProfileSkeleton from './ProfileSkeleton'
import ConfirmationModal from '../ui/ConfirmationModal'
import { manageCookies } from '../../utils/cookieManager'


const ProfilePage = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { isDarkMode } = useOutletContext()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const nameSchema = z.object({
        fullName: z.string().min(1, t('common.required', "Required"))
    })

    const emailSchema = z.object({
        email: z.string().email(t('common.invalid_email', "Invalid email"))
    })

    const phoneSchema = z.object({
        phone: z.string().min(7, t('common.required', "Required")),
        countryCode: z.string()
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

    const { register: registerPhone, handleSubmit: handleSubmitPhone, setValue: setValuePhone, watch: watchPhone, formState: { errors: errorsPhone, isSubmitting: isSubmittingPhone } } = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            countryCode: '+57'
        }
    })

    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword } } = useForm({
        resolver: zodResolver(passwordSchema)
    })

    // UI states
    const [isAdmin, setIsAdmin] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPhone, setIsEditingPhone] = useState(false)
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [cookieConsent, setCookieConsent] = useState(false)
    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const countryCodes = [
        { code: '+57', country: 'CO', flag: 'https://flagcdn.com/w40/co.png' },
        { code: '+1', country: 'US', flag: 'https://flagcdn.com/w40/us.png' },
        { code: '+52', country: 'MX', flag: 'https://flagcdn.com/w40/mx.png' },
        { code: '+34', country: 'ES', flag: 'https://flagcdn.com/w40/es.png' },
        { code: '+54', country: 'AR', flag: 'https://flagcdn.com/w40/ar.png' },
        { code: '+51', country: 'PE', flag: 'https://flagcdn.com/w40/pe.png' },
        { code: '+56', country: 'CL', flag: 'https://flagcdn.com/w40/cl.png' },
    ]

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    useEffect(() => {
        checkUser()
        const consent = localStorage.getItem('cookie_consent')
        setCookieConsent(consent === 'accepted')
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

        const phone = session.user.user_metadata?.phone || ''
        const countryCode = session.user.user_metadata?.countryCode || '+57'
        setValuePhone('phone', phone)
        setValuePhone('countryCode', countryCode)

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

    const onUpdatePhone = async (data) => {
        const { phone, countryCode } = data

        const { error } = await supabase.auth.updateUser({
            data: { phone, countryCode }
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.phone_updated'))
            setIsEditingPhone(false)
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

    const handleSaveCookiePreferences = () => {
        manageCookies(cookieConsent)
        toast.success(t('profile.preferences_saved'))
    }

    const handleSuspendAccount = async () => {
        try {
            const { error } = await supabase.rpc('suspend_own_account')
            if (error) throw error

            setShowSuspendModal(false)
            toast.success(t('profile.account_suspended'))

            // Sign out and redirect
            await supabase.auth.signOut()
            navigate(getLocalizedPath('/login'))
        } catch (error) {
            console.error('Error suspending account:', error)
            toast.error(error.message)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const { error } = await supabase.rpc('delete_own_account')
            if (error) throw error

            setShowDeleteModal(false)
            toast.success(t('profile.account_deleted'))

            // Sign out and redirect
            await supabase.auth.signOut()
            navigate(getLocalizedPath('/'))
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error(error.message)
        }
    }


    if (loading) {
        return <ProfileSkeleton isDarkMode={isDarkMode} />
    }

    return (
        <div className={`font-sans flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <SEO title={t('profile.title', 'Mi Perfil')} />


            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pt-12 pb-12 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-[95%] mx-auto text-white">
                    <h1 className={`text-5xl md:text-6xl font-semibold tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('profile.title')}
                    </h1>
                    <p className={`${isDarkMode ? 'text-white/60' : 'text-gray-500'} text-xl max-w-xl`}>
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
                    className={`max-w-[95%] mx-auto ${isDarkMode ? 'bg-[#111] border border-white/10' : 'bg-white'} rounded-[2.5rem] shadow-2xl p-8 md:p-12 min-h-[600px]`}
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
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Avatar</h3>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className={`w-24 h-24 rounded-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-white'} flex items-center justify-center border-4 shadow-lg relative overflow-hidden group`}>
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>
                                <div className={`flex-1 w-full md:w-auto border-2 border-dashed ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'} rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group`}>
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                                        <User size={20} />
                                    </div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Click here to upload your file or drag.</p>
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
                                    <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.full_name')}</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            {...registerName('fullName')}
                                            disabled={isAdmin || !isEditingName}
                                            className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-12 pr-12 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsName.fullName ? 'border-red-500' : ''} ${!isEditingName ? (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500') : ''} ${isAdmin ? 'bg-gray-200/50 cursor-not-allowed opacity-100' : ''}`}
                                            placeholder={t('profile.full_name_placeholder')}
                                        />
                                        {!isAdmin ? (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                {isEditingName ? (
                                                    <Tooltip content={t('common.save')}>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmittingName}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content={t('common.edit')}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setIsEditingName(true)
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        ) : (
                                            <Tooltip content={t('profile.edit_locked')}>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Lock size={18} />
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                    {errorsName.fullName && <p className="text-red-500 text-sm pl-1">{errorsName.fullName.message}</p>}
                                </form>

                                {/* Email Form */}
                                <form onSubmit={handleSubmitEmail(onUpdateEmail)} className="space-y-2">
                                    <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.email_address')}</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            {...registerEmail('email')}
                                            disabled={isAdmin || !isEditingEmail}
                                            className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-12 pr-12 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsEmail.email ? 'border-red-500' : ''} ${!isEditingEmail ? (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500') : ''} ${isAdmin ? 'bg-gray-200/50 cursor-not-allowed opacity-100' : ''}`}
                                            placeholder={t('auth.mail')}
                                        />
                                        {!isAdmin ? (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                {isEditingEmail ? (
                                                    <Tooltip content={t('common.save')}>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmittingEmail}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content={t('common.edit')}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setIsEditingEmail(true)
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        ) : (
                                            <Tooltip content={t('profile.edit_locked')}>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Lock size={18} />
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                    {errorsEmail.email && <p className="text-red-500 text-sm pl-1">{errorsEmail.email.message}</p>}
                                    {!isAdmin && <p className="text-xs text-gray-500">{t('profile.email_note')}</p>}
                                </form>

                                {/* Phone Form */}
                                <form onSubmit={handleSubmitPhone(onUpdatePhone)} className="space-y-2">
                                    <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.phone_number')}</label>
                                    <div className="flex gap-2">
                                        {/* Country Code Selector */}
                                        <div className="relative z-50">
                                            <button
                                                type="button"
                                                onClick={() => isEditingPhone && setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                                disabled={!isEditingPhone}
                                                className={`flex items-center gap-2 w-[110px] ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-3 pr-2 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${!isEditingPhone ? (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500 cursor-default') : 'cursor-pointer'}`}
                                            >
                                                <img
                                                    src={countryCodes.find(c => c.code === watchPhone('countryCode'))?.flag}
                                                    alt="Flag"
                                                    className="w-6 h-4 object-cover rounded-sm"
                                                />
                                                <span className="text-sm font-medium">{watchPhone('countryCode')}</span>
                                                <ChevronDown size={14} className={`ml-auto transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Dropdown */}
                                            <AnimatePresence>
                                                {isCountryDropdownOpen && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setIsCountryDropdownOpen(false)}
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            onWheel={(e) => e.stopPropagation()}
                                                            onTouchMove={(e) => e.stopPropagation()}
                                                            className={`absolute bottom-full left-0 mb-2 w-full min-w-[140px] z-50 ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'} border rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar overscroll-contain`}
                                                        >
                                                            {countryCodes.map((c) => (
                                                                <button
                                                                    key={c.code}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setValuePhone('countryCode', c.code)
                                                                        setIsCountryDropdownOpen(false)
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-200 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} ${watchPhone('countryCode') === c.code ? (isDarkMode ? 'bg-white/10' : 'bg-blue-50 text-blue-600') : ''}`}
                                                                >
                                                                    <img src={c.flag} alt={c.country} className="w-6 h-4 object-cover rounded-sm" />
                                                                    <span>{c.code}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Phone Input */}
                                        <div className="relative group flex-1">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                {...registerPhone('phone')}
                                                disabled={isSubmittingPhone || !isEditingPhone}
                                                className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-12 pr-12 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsPhone.phone ? 'border-red-500' : ''} ${!isEditingPhone ? (isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500') : ''}`}
                                                placeholder={t('profile.phone_placeholder')}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    {isEditingPhone ? (
                                                        <Tooltip content={t('common.save')}>
                                                            <button
                                                                type="submit"
                                                                disabled={isSubmittingPhone}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip content={t('common.edit')}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    setIsEditingPhone(true)
                                                                }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {errorsPhone.phone && <p className="text-red-500 text-sm pl-1">{errorsPhone.phone.message}</p>}
                                    <p className="text-xs text-gray-500">{t('profile.phone_note')}</p>
                                </form>
                            </div>

                            {/* Right Column - Password */}
                            <div className="space-y-8">
                                <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('profile.change_password')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                {...registerPassword('newPassword')}
                                                className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-12 pr-4 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsPassword.newPassword ? 'border-red-500' : ''}`}
                                                placeholder={t('profile.new_password')}
                                            />
                                        </div>
                                        {errorsPassword.newPassword && <p className="text-red-500 text-sm pl-1">{errorsPassword.newPassword.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.confirm_password')}</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                {...registerPassword('confirmPassword')}
                                                className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl py-3.5 pl-12 pr-4 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${errorsPassword.confirmPassword ? 'border-red-500' : ''}`}
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

                        {/* Settings Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                            className="mt-12 pt-12 border-t border-gray-200 dark:border-white/10"
                        >
                            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-8`}>
                                {t('profile.settings')}
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
                                {/* Cookie Preferences */}
                                <div className="space-y-6">
                                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                        <Shield size={20} className="text-blue-500" />
                                        {t('profile.cookies')}
                                    </h4>

                                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className={`font-medium block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {t('profile.marketing_cookies')}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {t('profile.marketing_cookies_desc')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setCookieConsent(!cookieConsent)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${cookieConsent ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${cookieConsent ? 'translate-x-5' : 'translate-x-0'}`}
                                                />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleSaveCookiePreferences}
                                            className="w-full py-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
                                        >
                                            {t('profile.save_preferences')}
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="space-y-6">
                                    <h4 className={`text-lg font-semibold text-red-500 flex items-center gap-2`}>
                                        <AlertCircle size={20} />
                                        {t('profile.danger_zone')}
                                    </h4>

                                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'border-red-900/30 bg-red-900/10' : 'border-red-200 bg-red-50'} space-y-4`}>
                                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 border-red-900/20' : 'bg-white border-red-100'}`}>
                                            <div>
                                                <span className={`font-medium block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {t('profile.suspend_account')}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                                    {t('profile.suspend_account_desc')}
                                                </p>
                                            </div>
                                            {isAdmin ? (
                                                <Tooltip content={t('profile.action_locked')}>
                                                    <button
                                                        disabled
                                                        className={`px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed flex items-center gap-2 ${isDarkMode ? 'bg-white/5 text-white/30' : ''}`}
                                                    >
                                                        <Lock size={14} />
                                                        {t('profile.suspend_account')}
                                                    </button>
                                                </Tooltip>
                                            ) : (
                                                <button
                                                    onClick={() => setShowSuspendModal(true)}
                                                    className={`px-4 py-2 text-sm font-medium text-red-600 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                                                >
                                                    {t('profile.suspend_account')}
                                                </button>
                                            )}
                                        </div>

                                        <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 border-red-900/20' : 'bg-white border-red-100'}`}>
                                            <div>
                                                <span className={`font-medium block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {t('profile.delete_account')}
                                                </span>
                                                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                                    {t('profile.delete_account_desc')}
                                                </p>
                                            </div>
                                            {isAdmin ? (
                                                <Tooltip content={t('profile.action_locked')}>
                                                    <button
                                                        disabled
                                                        className={`px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed flex items-center gap-2 ${isDarkMode ? 'bg-white/5 text-white/30' : ''}`}
                                                    >
                                                        <Lock size={14} />
                                                        {t('profile.delete_account')}
                                                    </button>
                                                </Tooltip>
                                            ) : (
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-600/20"
                                                >
                                                    {t('profile.delete_account')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Modals */}
                        <ConfirmationModal
                            isOpen={showSuspendModal}
                            onClose={() => setShowSuspendModal(false)}
                            onConfirm={handleSuspendAccount}
                            title={t('profile.suspend_confirm_title')}
                            message={t('profile.suspend_confirm_message')}
                            confirmText={t('profile.suspend_account')}
                            cancelText={t('common.cancel')}
                            variant="danger"
                            isDarkMode={isDarkMode}
                        />

                        <ConfirmationModal
                            isOpen={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleDeleteAccount}
                            title={t('profile.delete_confirm_title')}
                            message={t('profile.delete_confirm_message')}
                            confirmText={t('profile.delete_account')}
                            cancelText={t('common.cancel')}
                            variant="critical"
                            isDarkMode={isDarkMode}
                        />

                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ProfilePage
