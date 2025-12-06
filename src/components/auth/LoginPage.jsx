import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedButton from '../ui/AnimatedButton'
import { supabase } from '../../lib/supabase'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'

import SEO from '../ui/SEO'

import '../JetonHeader.css'

import { useMenu } from '../../hooks/useMenu'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rememberMe: z.boolean().optional()
})

const LoginPage = () => {
    const navigate = useNavigate()
    const { navigateWithTransition } = useMenu()
    const { t, i18n } = useTranslation()
    const [showPassword, setShowPassword] = React.useState(false)

    // ... (rest of schema and useForm) ...

    const { register, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    })

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    // Check for remembered email on mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
            setValue('email', rememberedEmail)
            setValue('rememberMe', true)
        }
    }, [setValue])

    const onSubmit = async (data) => {
        const { email, password, rememberMe } = data

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError('password', { type: 'manual', message: t('auth.errors.login_failed') })
        } else {
            // Guardar o eliminar email según checkbox "Recordarme" (Keep for pre-filling if needed, though usually browser handles this)
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email)
            } else {
                localStorage.removeItem('rememberedEmail')
            }
            navigateWithTransition(getLocalizedPath('/dashboard'))
        }
    }


    // Helper to render input fields
    const renderInput = (label, fieldName, type = "text", Icon, placeholder, isPassword = false, showPass = false, setShowPass = null) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">{label}</label>
            <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${errors[fieldName] ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                    <Icon size={20} />
                </div>
                <input
                    type={isPassword ? (showPass ? "text" : "password") : type}
                    {...register(fieldName)}
                    className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 ${isPassword ? 'pr-12' : 'pr-10'} text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${errors[fieldName]
                        ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                        : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                        }`}
                    placeholder={placeholder}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none z-10"
                    >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {errors[fieldName] && (
                    <div className={`absolute ${isPassword ? 'right-12 pr-2' : 'right-3'} top-1/2 -translate-y-1/2 text-red-400 pointer-events-none`}>
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {errors[fieldName] && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs ml-1 flex items-center gap-1"
                >
                    {errors[fieldName].message}
                </motion.p>
            )}
        </div>
    )

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
            <SEO title={t('auth.login_title', 'Iniciar Sesión')} />
            {/* Navbar Structure for Logo */}
            <div className="_navbar">
                <div className="nav-container flex justify-between items-center">
                    <a
                        href={getLocalizedPath('/')}
                        onClick={(e) => {
                            e.preventDefault()
                            navigateWithTransition(getLocalizedPath('/'))
                        }}
                        className="text-3xl font-display font-semibold text-white tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        Ta' <span className="text-accent">To'</span> Clean
                    </a>
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
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-semibold text-white mb-2">{t('auth.login_title', 'Iniciar Sesión')}</h1>
                            <p className="text-white/60">{t('auth.login_subtitle', 'Bienvenido de nuevo')}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                            {renderInput(t('auth.email'), "email", "email", Mail, t('auth.mail'))}
                            {renderInput(t('auth.password'), "password", "password", Lock, "••••••••", true, showPassword, setShowPassword)}

                            <div className="flex items-center justify-between text-sm w-full gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            {...register('rememberMe')}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-white/40"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                                    </div>
                                    <label htmlFor="rememberMe" className="text-white/60 cursor-pointer select-none hover:text-white transition-colors">
                                        {t('auth.remember_me', 'Recordarme')}
                                    </label>
                                </div>
                                <a
                                    href={getLocalizedPath('/forgot-password')}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigateWithTransition(getLocalizedPath('/forgot-password'))
                                    }}
                                    className="text-white/60 hover:text-white transition-colors text-right ml-auto"
                                >
                                    {t('auth.forgot_password')}
                                </a>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('auth.login_button')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                {t('auth.no_account')}{' '}
                                <a
                                    href={getLocalizedPath('/signup')}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigateWithTransition(getLocalizedPath('/signup'))
                                    }}
                                    className="text-white font-medium hover:underline"
                                >
                                    {t('auth.register_here')}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage
