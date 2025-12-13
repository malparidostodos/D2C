import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, Car, Shield, Check, Award, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'

const FeaturedServices = () => {
    const { t } = useTranslation()
    const { getLocalizedPath, navigateWithTransition } = useMenu()

    const services = [
        {
            icon: Sparkles,
            title: "Lavado Premium",
            description: "Limpieza profunda y detallada para devolverle el brillo a tu vehículo.",
            link: "/services"
        },
        {
            icon: Car,
            title: "Detailing Interior",
            description: "Renovación completa de tapicería, plásticos y cada rincón de la cabina.",
            link: "/services"
        },
        {
            icon: Shield,
            title: "Pulido & Corrección",
            description: "Eliminación de imperfecciones y protección cerámica para un acabado espejo.",
            link: "/services"
        }
    ]

    return (
        <section className="bg-white pt-48 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container with subtle gradient */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                    {/* Subtle vertical gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-4"
                        >
                            Nuestros Servicios Destacados
                        </motion.h2>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap items-center justify-center gap-6 mb-6"
                        >
                            {[
                                { icon: Check, text: "Productos premium" },
                                { icon: Award, text: "Técnicos certificados" },
                                { icon: Zap, text: "Garantía de satisfacción" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-white/90 text-sm">
                                    <badge.icon className="w-4 h-4 text-white" />
                                    <span>{badge.text}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-1 w-24 bg-white mx-auto rounded-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(255,255,255,0.25)] hover:border-white/40 transition-all duration-300 group"
                            >
                                {/* Icon with personality */}
                                <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                                <p className="text-white/80 mb-8 leading-relaxed">
                                    {service.description}
                                </p>
                                <Link
                                    to={getLocalizedPath(service.link)}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        navigateWithTransition(getLocalizedPath(service.link))
                                    }}
                                    className="inline-flex items-center text-white hover:text-white/80 font-medium transition-colors group-hover:gap-3"
                                >
                                    Explorar servicio <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturedServices
