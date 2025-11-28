import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        id: 1,
        name: "Carlos Rodríguez",
        role: "Dueño de BMW M4",
        content: "Increíble atención al detalle. El tratamiento cerámico dejó mi coche mejor que cuando salió del concesionario. Totalmente recomendado.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=1"
    },
    {
        id: 2,
        name: "Ana Martínez",
        role: "Dueña de Porsche Macan",
        content: "El servicio de recogida y entrega es un plus enorme. La limpieza interior fue impecable, eliminaron manchas que pensé que eran permanentes.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=2"
    },
    {
        id: 3,
        name: "David Valencia",
        role: "Dueño de Tesla Model 3",
        content: "Profesionales de verdad. Me explicaron todo el proceso y los productos que usarían. El resultado final superó mis expectativas.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=3"
    }
]

const Testimonials = () => {
    return (
        <section className="py-24 px-4 md:px-8 bg-[#050505] relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block"
                    >
                        Testimonios
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
                    >
                        Lo que dicen nuestros <span className="text-accent">Clientes</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors relative group"
                        >
                            <div className="absolute top-8 right-8 text-white/10 group-hover:text-accent/20 transition-colors">
                                <Quote size={40} />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            <p className="text-white/80 mb-8 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full border-2 border-white/10"
                                />
                                <div>
                                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                                    <p className="text-white/40 text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
