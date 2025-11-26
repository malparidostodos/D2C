import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Forgot password attempt:', { email })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
            {/* Back to Home Link */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium tracking-wide">Volver al Inicio</span>
            </Link>

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
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-display font-bold text-white mb-2">Recuperar Contraseña</h1>
                            <p className="text-white/60">Ingresa tu email para recibir un enlace de recuperación</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors duration-300">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Enviar Enlace
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                ¿Recordaste tu contraseña?{' '}
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

export default ForgotPasswordPage
