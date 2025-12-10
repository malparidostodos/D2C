import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, MessageCircle } from 'lucide-react'
import { useMenu } from '../../hooks/useMenu'

const FinalCTA = () => {
    const { getLocalizedPath, navigateWithTransition } = useMenu()

    return (
        <section className="bg-white py-20 px-4 relative overflow-hidden">
            {/* Decorative Background Patterns */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 to-transparent opacity-50" />
                <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-[#0046b8] mb-8 font-display"
                >
                    ¿Listo para renovar tu vehículo?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link
                        to={getLocalizedPath("/reserva")}
                        onClick={(e) => {
                            e.preventDefault()
                            navigateWithTransition(getLocalizedPath("/reserva"))
                        }}
                        className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#0046b8] text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/10 hover:scale-105"
                    >
                        <Calendar className="mr-2 w-5 h-5" />
                        Agendar Ahora
                    </Link>

                    <a
                        href="https://wa.me/1234567890" // TODO: Add real number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#0046b8]/20 text-[#0046b8] rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300"
                    >
                        <MessageCircle className="mr-2 w-5 h-5" />
                        WhatsApp Directo
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default FinalCTA
