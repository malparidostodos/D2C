import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Modal from '../ui/Modal'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'
import Header from '../layout/Header'

import SEO from '../ui/SEO'

import '../JetonHeader.css'

import { useMenu } from '../../hooks/useMenu'

const SignUpPage = () => {
    const navigate = useNavigate()
    const { navigateWithTransition } = useMenu()
    const { t, i18n } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // ... (schema and forms) ...
    const signupSchema = z.object({
        name: z.string().min(1, t('auth.errors.required')),
        email: z.string().min(1, t('auth.errors.required')).email(t('auth.errors.invalid_email')),
        password: z.string().min(6, t('auth.errors.password_length')),
        confirmPassword: z.string().min(1, t('auth.errors.required')),
        termsAccepted: z.boolean().refine(val => val === true, {
            message: t('auth.errors.terms_required')
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('auth.errors.password_mismatch'),
        path: ["confirmPassword"],
    })

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false
        }
    })

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    const onSubmit = async (data) => {
        const { name, email, password } = data

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        })

        if (error) {
            setError('email', { type: 'manual', message: error.message })
        } else {
            // 📧 Enviar correo de bienvenida
            await supabase.functions.invoke('send-welcome-email', {
                body: { email, name, password }
            })

            setShowSuccessModal(true)
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
            <SEO title={t('auth.signup_title', 'Crear Cuenta')} />
            {/* Navbar Structure */}
            <Header alwaysVisible={true} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-20"
            >
                {/* Glass Card */}
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    {/* ... (blobs) ... */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-semibold text-white mb-2">{t('auth.create_account')}</h1>
                            <p className="text-white/60">{t('auth.signup_subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            {renderInput(t('auth.full_name'), "name", "text", User, "Juan Pérez")}
                            {renderInput(t('auth.email'), "email", "email", Mail, t('auth.mail'))}
                            {renderInput(t('auth.password'), "password", "password", Lock, "••••••••", true, showPassword, setShowPassword)}
                            {renderInput(t('auth.confirm_password'), "confirmPassword", "password", Lock, "••••••••", true, showConfirmPassword, setShowConfirmPassword)}

                            <div className="space-y-2">
                                <div className="flex items-start gap-3 pt-2">
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            {...register('termsAccepted')}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-white/40"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-white/60 cursor-pointer select-none leading-tight">
                                        {t('auth.terms_agreement')}{' '}
                                        <Link to={getLocalizedPath('/terms-conditions')} className="text-white hover:text-[var(--color-blue-light)] transition-colors hover:underline" target="_blank">
                                            {t('auth.terms_link')}
                                        </Link>
                                        {' '}{t('auth.and')}{' '}
                                        <Link to={getLocalizedPath('/privacy-policy')} className="text-white hover:text-[var(--color-blue-light)] transition-colors hover:underline" target="_blank">
                                            {t('auth.privacy_link')}
                                        </Link>
                                    </label>
                                </div>
                                {errors.termsAccepted && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs ml-1"
                                    >
                                        {errors.termsAccepted.message}
                                    </motion.p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('auth.register_button')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                {t('auth.already_have_account')}{' '}
                                <a
                                    href={getLocalizedPath('/login')}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigateWithTransition(getLocalizedPath('/login'))
                                    }}
                                    className="text-white font-medium hover:underline"
                                >
                                    {t('auth.login_here')}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false)
                    navigateWithTransition(getLocalizedPath('/login'))
                }}
                title={t('auth.welcome_modal_title')}
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                        <CheckCircle size={32} />
                    </div>
                    <p className="text-white/80">
                        {t('auth.welcome_modal_message')}
                    </p>
                    <button
                        onClick={() => navigateWithTransition(getLocalizedPath('/login'))}
                        className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors mt-4"
                    >
                        {t('auth.go_to_login')}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SignUpPage
