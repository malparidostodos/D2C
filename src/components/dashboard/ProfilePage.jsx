import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'

const ProfilePage = () => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Form states
    const [fullName, setFullName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // UI states
    const [updating, setUpdating] = useState(false)
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
        setFullName(session.user.user_metadata?.full_name || '')
        setNewEmail(session.user.email || '')
        setLoading(false)
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const handleUpdateName = async (e) => {
        e.preventDefault()
        if (!fullName.trim()) {
            showMessage('error', t('profile.name_required'))
            return
        }

        setUpdating(true)
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.name_updated'))
            checkUser() // Refresh user data
        }
        setUpdating(false)
    }

    const handleUpdateEmail = async (e) => {
        e.preventDefault()
        if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            showMessage('error', t('auth.errors.invalid_email'))
            return
        }

        setUpdating(true)
        const { error } = await supabase.auth.updateUser({
            email: newEmail
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.email_updated'))
        }
        setUpdating(false)
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()

        if (newPassword.length < 6) {
            showMessage('error', t('auth.errors.password_length'))
            return
        }

        if (newPassword !== confirmPassword) {
            showMessage('error', t('auth.errors.password_mismatch'))
            return
        }

        setUpdating(true)
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            showMessage('error', error.message)
        } else {
            showMessage('success', t('profile.password_updated'))
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
        setUpdating(false)
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
                    </div>
                    <form onSubmit={handleUpdateName} className="space-y-4">
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder={t('profile.full_name_placeholder')}
                        />
                        <AnimatedButton
                            type="submit"
                            disabled={updating || !fullName.trim()}
                            className={`w-full ${updating || !fullName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {updating ? t('profile.updating') : t('profile.update_name')}
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
                    </div>
                    <form onSubmit={handleUpdateEmail} className="space-y-4">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder={t('auth.mail')}
                        />
                        <p className="text-white/40 text-sm">{t('profile.email_note')}</p>
                        <AnimatedButton
                            type="submit"
                            disabled={updating || !newEmail.trim() || newEmail === user?.email}
                            className={`w-full ${updating || !newEmail.trim() || newEmail === user?.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {updating ? t('profile.updating') : t('profile.update_email')}
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
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder={t('profile.new_password')}
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder={t('auth.confirm_password')}
                        />
                        <AnimatedButton
                            type="submit"
                            disabled={updating || !newPassword || !confirmPassword}
                            className={`w-full ${updating || !newPassword || !confirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {updating ? t('profile.updating') : t('profile.update_password')}
                        </AnimatedButton>
                    </form>
                </motion.section>
            </div>
        </div>
    )
}

export default ProfilePage
