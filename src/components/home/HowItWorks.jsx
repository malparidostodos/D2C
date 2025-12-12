import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Truck, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'
import RecentResults from './RecentResults'

const HowItWorks = () => {
    const { getLocalizedPath, navigateWithTransition } = useMenu()

    const steps = [
        {
            icon: Calendar,
            title: "Agenda tu servicio",
            description: "Elige el paquete y el horario que mejor se adapte a ti."
        },
        {
            icon: Truck,
            title: "Llevamos tu vehículo",
            description: "Nos encargamos de transportarlo o vamos a donde estés."
        },
        {
            icon: Star,
            title: "Lo recibes como nuevo",
            description: "Disfruta de resultados impecables y garantizados."
        }
    ]

    return (
        <section className="bg-white pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-20 -mt-[100vh]">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16">
                    {/* How It Works Section */}
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-4"
                        >
                            Cómo funciona
                        </motion.h2>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            Simple, rápido y profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mb-24">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-white/0 via-white/50 to-white/0 z-0" />

                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 shadow-xl shadow-blue-900/20 border border-white/20">
                                    <step.icon className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                                <p className="text-white/80 leading-relaxed max-w-xs">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detail Level Section */}
                    <div className="text-center mb-24 py-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight"
                        >
                            El nivel de detalle que<br />tu carro merece
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-lg max-w-3xl mx-auto mb-8"
                        >
                            En <span className="font-semibold">Ta' To' Clean</span> tratamos cada vehículo como si fuera nuestro.
                            <br />
                            Nos enfocamos en el detalle, la precisión y el uso de productos premium que garantizan
                            resultados visibles desde el primer vistazo. Tu carro no solo queda limpio: queda
                            protegido, renovado y cuidado con dedicación profesional.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                to={getLocalizedPath("/servicios")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigateWithTransition(getLocalizedPath("/servicios"))
                                }}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                            >
                                ✨ PASIÓN POR EL DETALLE
                            </Link>
                        </motion.div>
                    </div>

                    {/* Recent Results - Integrated */}
                    <div className="mb-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-12 text-center"
                        >
                            Resultados Recientes
                        </motion.h2>

                        <RecentResults embedded={true} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
