import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedButton from '../ui/AnimatedButton'
import { supabase } from '../../lib/supabase'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'

import '../JetonHeader.css'

const LoginPage = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    // Cargar email guardado al montar el componente
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail')
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberMe(true)
        }
    }, [])

    const validateForm = (values = {}) => {
        const newErrors = {}
        const currentEmail = values.email !== undefined ? values.email : email
        const currentPassword = values.password !== undefined ? values.password : password

        if (!currentEmail) {
            newErrors.email = t('auth.errors.required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
            newErrors.email = t('auth.errors.invalid_email')
        }

        if (!currentPassword) {
            newErrors.password = t('auth.errors.required')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Mark all as touched
        setTouched({
            email: true,
            password: true
        })

        if (validateForm()) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                setErrors({ ...errors, password: t('auth.errors.login_failed') })
            } else {
                // Guardar o eliminar email según checkbox "Recordarme"
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email)
                } else {
                    localStorage.removeItem('rememberedEmail')
                }
                navigate(getLocalizedPath('/dashboard'))
            }
        }
    }

    const handleBlur = (field, value) => {
        if (value && value.trim()) {
            setTouched(prev => ({ ...prev, [field]: true }))
            validateForm()
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
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
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">{t('auth.welcome')}</h1>
                            <p className="text-white/60">{t('auth.login_subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">{t('auth.email')}</label>
                                <div className="relative group">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${touched.email && errors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            const newValue = e.target.value
                                            setEmail(newValue)
                                            if (touched.email) validateForm({ email: newValue })
                                        }}
                                        onBlur={(e) => handleBlur('email', e.target.value)}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-10 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${touched.email && errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                                            : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                                            }`}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {touched.email && errors.email && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none">
                                            <AlertCircle size={18} />
                                        </div>
                                    )}
                                </div>
                                {touched.email && errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs ml-1 flex items-center gap-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">{t('auth.password')}</label>
                                <div className="relative group">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${touched.password && errors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            const newValue = e.target.value
                                            setPassword(newValue)
                                            if (touched.password) validateForm({ password: newValue })
                                        }}
                                        onBlur={(e) => handleBlur('password', e.target.value)}
                                        className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${touched.password && errors.password
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

                                    {touched.password && errors.password && (
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none pr-2">
                                            <AlertCircle size={18} />
                                        </div>
                                    )}
                                </div>
                                {touched.password && errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs ml-1 flex items-center gap-1"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm w-full gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-white/30 bg-white/5 group-hover:border-white/50'
                                        }`}>
                                        {rememberMe && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-white/60 group-hover:text-white/80 transition-colors">{t('auth.remember_me')}</span>
                                </label>
                                <Link to={getLocalizedPath('/forgot-password')} className="text-white/60 hover:text-white transition-colors text-right ml-auto">{t('auth.forgot_password')}</Link>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('auth.login_button')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                {t('auth.no_account')}{' '}
                                <Link to={getLocalizedPath('/signup')} className="text-white font-medium hover:underline">
                                    {t('auth.register_here')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage
