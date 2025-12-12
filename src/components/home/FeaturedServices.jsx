import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, Car, Shield } from 'lucide-react'
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
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-4"
                        >
                            Nuestros Servicios Destacados
                        </motion.h2>
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
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="w-7 h-7 text-white" />
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
                                    className="inline-flex items-center text-white hover:text-white/80 font-medium transition-colors"
                                >
                                    Ver más <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
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
