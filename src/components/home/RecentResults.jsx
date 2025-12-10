import React from 'react'
import { motion } from 'framer-motion'

// Placeholder images
const BeforeAfterCard = ({ before, after, label, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-blue-900/20"
        >
            {/* Split View Effect */}
            <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-neutral-800 relative overflow-hidden">
                    <img src={before} alt="Antes" className="absolute inset-0 w-[200%] h-full object-cover object-left" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        Antes
                    </div>
                </div>
                <div className="w-1/2 h-full bg-neutral-700 relative overflow-hidden">
                    <img src={after} alt="Después" className="absolute inset-0 w-[200%] h-full object-cover object-right transform -translate-x-1/2" />
                    <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        Después
                    </div>
                </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-xl font-bold text-white">{label}</h3>
            </div>
        </motion.div>
    )
}

const RecentResults = () => {
    const results = [
        {
            before: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
            label: "Renovación Interior"
        },
        {
            before: "https://images.unsplash.com/photo-1595786195726-25925e064972?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1595786195709-32fb33c7f957?q=80&w=1000&auto=format&fit=crop",
            label: "Corrección de Pintura"
        },
        {
            before: "https://images.unsplash.com/photo-1625043484555-5f33465133b7?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1550983756-34351c221297?q=80&w=1000&auto=format&fit=crop",
            label: "Detailing de Rines"
        }
    ]

    return (
        <section className="bg-[#0046b8] py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-12 text-center font-display"
                >
                    Resultados Recientes
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.map((item, index) => (
                        <BeforeAfterCard
                            key={index}
                            {...item}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RecentResults
