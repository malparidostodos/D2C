import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Modal from '../ui/Modal'
import LanguageSelector from '../ui/LanguageSelector'
import { useTranslation } from 'react-i18next'

import '../JetonHeader.css'

const SignUpPage = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    const validateForm = (values = {}) => {
        const newErrors = {}
        const currentName = values.name !== undefined ? values.name : name
        const currentEmail = values.email !== undefined ? values.email : email
        const currentPassword = values.password !== undefined ? values.password : password
        const currentConfirmPassword = values.confirmPassword !== undefined ? values.confirmPassword : confirmPassword
        const currentTermsAccepted = values.termsAccepted !== undefined ? values.termsAccepted : termsAccepted

        if (!currentName.trim()) {
            newErrors.name = t('auth.errors.required')
        }

        if (!currentEmail) {
            newErrors.email = t('auth.errors.required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
            newErrors.email = t('auth.errors.invalid_email')
        }

        if (!currentPassword) {
            newErrors.password = t('auth.errors.required')
        }

        if (!currentConfirmPassword) {
            newErrors.confirmPassword = t('auth.errors.required')
        } else if (currentPassword !== currentConfirmPassword) {
            newErrors.confirmPassword = t('auth.errors.password_mismatch')
        }

        if (!currentTermsAccepted) {
            newErrors.terms = t('auth.errors.terms_required')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            terms: true
        })

        if (validateForm()) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            })

            if (error) {
                setErrors({ ...errors, email: error.message })
            } else {
                // 📧 Enviar correo de bienvenida
                await supabase.functions.invoke('send-welcome-email', {
                    body: { email, name, password }
                })

                setShowSuccessModal(true)
            }
        }
    }

    const handleBlur = (field, value) => {
        if (value && value.trim()) {
            setTouched(prev => ({ ...prev, [field]: true }))
            validateForm()
        }
    }

    // Helper to render input fields
    const renderInput = (label, value, setValue, fieldName, type = "text", Icon, placeholder, isPassword = false, showPass = false, setShowPass = null) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">{label}</label>
            <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${touched[fieldName] && errors[fieldName] ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                    <Icon size={20} />
                </div>
                <input
                    type={isPassword ? (showPass ? "text" : "password") : type}
                    value={value}
                    onChange={(e) => {
                        const newValue = e.target.value
                        setValue(newValue)
                        if (touched[fieldName]) validateForm({ [fieldName]: newValue })
                    }}
                    onBlur={(e) => handleBlur(fieldName, e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 ${isPassword ? 'pr-12' : 'pr-10'} text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${touched[fieldName] && errors[fieldName]
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

                {touched[fieldName] && errors[fieldName] && (
                    <div className={`absolute ${isPassword ? 'right-12 pr-2' : 'right-3'} top-1/2 -translate-y-1/2 text-red-400 pointer-events-none`}>
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {touched[fieldName] && errors[fieldName] && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs ml-1 flex items-center gap-1"
                >
                    {errors[fieldName]}
                </motion.p>
            )}
        </div>
    )

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
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">{t('auth.create_account')}</h1>
                            <p className="text-white/60">{t('auth.signup_subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {renderInput(t('auth.full_name'), name, setName, "name", "text", User, "Juan Pérez")}
                            {renderInput(t('auth.email'), email, setEmail, "email", "email", Mail, t('auth.mail'))}
                            {renderInput(t('auth.password'), password, setPassword, "password", "password", Lock, "••••••••", true, showPassword, setShowPassword)}
                            {renderInput(t('auth.confirm_password'), confirmPassword, setConfirmPassword, "confirmPassword", "password", Lock, "••••••••", true, showConfirmPassword, setShowConfirmPassword)}

                            <div className="space-y-2">
                                <div className="flex items-start gap-3 pt-2">
                                    <div className="relative flex items-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={termsAccepted}
                                            onChange={(e) => {
                                                setTermsAccepted(e.target.checked)
                                                if (touched.terms) validateForm({ termsAccepted: e.target.checked })
                                            }}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-white/40"
                                        />
                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-white/60 cursor-pointer select-none leading-tight">
                                        {t('auth.terms_agreement')}{' '}
                                        <Link to={getLocalizedPath('/terms-conditions')} className="text-white hover:text-blue-400 transition-colors hover:underline" target="_blank">
                                            {t('auth.terms_link')}
                                        </Link>
                                        {' '}{t('auth.and')}{' '}
                                        <Link to={getLocalizedPath('/privacy-policy')} className="text-white hover:text-blue-400 transition-colors hover:underline" target="_blank">
                                            {t('auth.privacy_link')}
                                        </Link>
                                    </label>
                                </div>
                                {touched.terms && errors.terms && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs ml-1"
                                    >
                                        {errors.terms}
                                    </motion.p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t('auth.register_button')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                {t('auth.already_have_account')}{' '}
                                <Link to={getLocalizedPath('/login')} className="text-white font-medium hover:underline">
                                    {t('auth.login_here')}
                                </Link>
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
                    navigate(getLocalizedPath('/login'))
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
                        onClick={() => navigate(getLocalizedPath('/login'))}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors mt-4"
                    >
                        {t('auth.go_to_login')}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SignUpPage
