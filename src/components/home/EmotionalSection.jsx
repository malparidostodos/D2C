import React from 'react'
import { motion } from 'framer-motion'

const EmotionalSection = () => {
    return (
        <section className="bg-[#0046b8] py-24 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white font-display leading-tight">
                        El nivel de detalle que <br />
                        <span className="text-blue-300">tu carro merece</span>
                    </h2>

                    <div className="space-y-6 text-lg md:text-xl text-blue-100 leading-relaxed font-light">
                        <p>
                            En <span className="text-white font-medium">Ta’ To’ Clean</span> tratamos cada vehículo como si fuera nuestro.
                        </p>
                        <p>
                            Nos enfocamos en el detalle, la precisión y el uso de productos premium que garantizan resultados visibles desde el primer vistazo. Tu carro no solo queda limpio: queda protegido, renovado y cuidado con dedicación profesional.
                        </p>
                    </div>

                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
                            PASIÓN POR EL DETALLE
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default EmotionalSection
