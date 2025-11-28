import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Gallery = () => {
    const [sliderValue, setSliderValue] = useState(50)
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const percentage = (x / rect.width) * 100
        setSliderValue(percentage)
    }

    const handleMouseDown = () => setIsDragging(true)
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (e) => {
        if (isDragging) {
            handleDrag(e)
        }
    }

    return (
        <section className="py-24 px-4 md:px-8 bg-[#050505] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block"
                    >
                        Resultados Reales
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
                    >
                        Antes y <span className="text-accent">Después</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        Desliza para ver la transformación. Nuestros tratamientos devuelven la vida a tu vehículo.
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    {/* Image Container */}
                    <div
                        className="relative w-full h-full cursor-ew-resize select-none"
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
                            const percentage = (x / rect.width) * 100
                            setSliderValue(percentage)
                        }}
                    >
                        {/* After Image (Base) */}
                        <div className="absolute inset-0">
                            <img
                                src="/images/after.jpg"
                                alt="Después"
                                className="w-full h-full object-cover"
                                draggable="false"
                            />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10">
                                DESPUÉS
                            </div>
                        </div>

                        {/* Before Image (Overlay) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${sliderValue}%` }}
                        >
                            <img
                                src="/images/before.jpg"
                                alt="Antes"
                                className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
                                style={{ width: '100vw', maxWidth: '1152px' }} // Ajustar al ancho del contenedor padre
                                draggable="false"
                            />
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10">
                                ANTES
                            </div>
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
                                <div className="flex gap-1">
                                    <ChevronLeft size={16} className="text-black" />
                                    <ChevronRight size={16} className="text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Gallery
