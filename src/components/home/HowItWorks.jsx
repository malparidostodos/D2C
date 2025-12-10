import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Truck, Star } from 'lucide-react'

const HowItWorks = () => {
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
        <section className="bg-[#0046b8] py-24 px-4 sm:px-6 lg:px-8 relative z-20 -mt-[100vh]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white font-display mb-4"
                    >
                        Cómo funciona
                    </motion.h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Simple, rápido y profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 z-0" />

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
                            <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-blue-100 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
