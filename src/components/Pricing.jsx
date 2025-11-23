import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

const Pricing = () => {
    const plans = [
        {
            name: 'Básico',
            description: 'Mantenimiento esencial para tu vehículo',
            price: '50.000',
            period: '/mes',
            features: [
                '2 Lavados Express al mes',
                'Limpieza de llantas',
                'Aspirado básico',
                'Cera rápida'
            ],
            highlight: false
        },
        {
            name: 'Premium',
            description: 'El equilibrio perfecto entre cuidado y protección',
            price: '300.000',
            period: '/mes',
            features: [
                '3 Lavados Premium al mes',
                'Descontaminación de pintura',
                'Hidratación de plásticos',
                'Encerado manual'
            ],
            highlight: true
        },
        {
            name: 'Élite',
            description: 'La máxima experiencia de detailing',
            price: '1.000.000',
            period: '/mes',
            features: [
                '4 Lavados Full Detailing al mes',
                'Corrección de pintura semestral',
                'Recubrimiento cerámico anual',
                'Servicio de recogida y entrega'
            ],
            highlight: false
        }
    ]

    return (
        <section id="membresias" className="py-32 bg-background relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-20">
                    <span className="text-accent font-medium tracking-widest uppercase text-sm">Planes Exclusivos</span>
                    <h2 className="text-5xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
                        Membresías
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-light">
                        Eleva el cuidado de tu vehículo con nuestros planes de suscripción.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                ? 'bg-white/10 border-white/20'
                                : 'bg-surface border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                    Más Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/40 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-light text-white">$</span>
                                <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                                <span className="text-white/40 ml-2">{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-white/70">
                                        <div className="mt-1 p-0.5 rounded-full bg-white/10 text-white">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] ${plan.highlight
                                    ? 'bg-accent text-white hover:bg-accent/90'
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                <span>Elegir Plan</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing
