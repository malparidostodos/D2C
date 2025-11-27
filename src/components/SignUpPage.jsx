import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import './JetonHeader.css'

const SignUpPage = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validateForm = (values = {}) => {
        const newErrors = {}
        const currentName = values.name !== undefined ? values.name : name
        const currentEmail = values.email !== undefined ? values.email : email
        const currentPassword = values.password !== undefined ? values.password : password
        const currentConfirmPassword = values.confirmPassword !== undefined ? values.confirmPassword : confirmPassword

        if (!currentName.trim()) {
            newErrors.name = 'Completa este campo'
        }

        if (!currentEmail) {
            newErrors.email = 'Completa este campo'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
            newErrors.email = 'Ingresa un correo válido'
        }

        if (!currentPassword) {
            newErrors.password = 'Completa este campo'
        }

        if (!currentConfirmPassword) {
            newErrors.confirmPassword = 'Completa este campo'
        } else if (currentPassword !== currentConfirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
            confirmPassword: true
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
                alert('Cuenta creada! Revisa tu email para confirmar.')
                navigate('/login')
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
    const renderInput = (label, value, setValue, fieldName, type = "text", Icon, placeholder) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">{label}</label>
            <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${touched[fieldName] && errors[fieldName] ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`}>
                    <Icon size={20} />
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => {
                        const newValue = e.target.value
                        setValue(newValue)
                        if (touched[fieldName]) validateForm({ [fieldName]: newValue })
                    }}
                    onBlur={(e) => handleBlur(fieldName, e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-10 text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${touched[fieldName] && errors[fieldName]
                        ? 'border-red-500 focus:border-red-500 focus:bg-red-500/5'
                        : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                        }`}
                    placeholder={placeholder}
                />
                {touched[fieldName] && errors[fieldName] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none">
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
                <div className="nav-container">
                    <Link
                        to="/"
                        className="text-3xl font-display font-bold text-black tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        Ta' <span className="text-accent">To'</span> Clean
                    </Link>
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
                            <h1 className="text-3xl font-display font-bold text-white mb-2">Crear Cuenta</h1>
                            <p className="text-white/60">Únete a nosotros para una experiencia premium</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {renderInput("Nombre Completo", name, setName, "name", "text", User, "Juan Pérez")}
                            {renderInput("Email", email, setEmail, "email", "email", Mail, "ejemplo@correo.com")}
                            {renderInput("Contraseña", password, setPassword, "password", "password", Lock, "••••••••")}
                            {renderInput("Confirmar Contraseña", confirmPassword, setConfirmPassword, "confirmPassword", "password", Lock, "••••••••")}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="text-white font-medium hover:underline">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage
