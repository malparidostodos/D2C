import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import SEO from '../ui/SEO'

const Gallery = () => {
    const { t } = useTranslation()
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

    const containerRef = React.useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)

    React.useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth)
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <section className="py-24 px-4 md:px-8 bg-white relative overflow-hidden">
            <SEO title={t('gallery.title', 'Galería')} description={t('gallery.description', 'Resultados reales de nuestros servicios')} />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[#0046b8] text-sm font-bold tracking-widest uppercase mb-4 block"
                    >
                        {t('gallery.subtitle', 'Resultados Reales')}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl md:text-6xl font-display font-bold text-[#0046b8] mb-6 cursor-default"
                    >
                        {t('gallery.title_before', 'Antes y')} <span className="text-[#0046b8]">{t('gallery.title_after', 'Después')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#0046b8] max-w-2xl mx-auto text-lg cursor-default"
                    >
                        {t('gallery.description', 'Desliza para ver la transformación. Nuestros tratamientos devuelven la vida a tu vehículo.')}
                    </motion.p>
                </div>

                <div
                    ref={containerRef}
                    className="relative max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden border border-blue-100 shadow-2xl bg-[#0046b8]"
                >
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
                        {/* After Image (Base) - Clean */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0046b8] to-[#00358a]">
                            <img
                                src="/images/vehiculos/sedan.png"
                                alt="Después"
                                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                draggable="false"
                            />
                        </div>

                        {/* Before Image (Overlay) - Dirty Effect */}
                        <div
                            className="absolute inset-0 overflow-hidden bg-[#1a1a1a] border-r border-white/20"
                            style={{ width: `${sliderValue}%` }}
                        >
                            <div
                                className="absolute top-0 left-0 h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#000]"
                                style={{ width: containerWidth }}
                            >
                                <img
                                    src="/images/vehiculos/sedan.png"
                                    alt="Antes"
                                    className="w-[80%] h-[80%] object-contain filter grayscale sepia-[0.4] brightness-[0.6] opacity-80"
                                    draggable="false"
                                />
                            </div>
                        </div>

                        {/* Labels - Positioned absolutely on top of everything */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10 z-30 pointer-events-none">
                            {t('gallery.label_before', 'ANTES')}
                        </div>
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10 z-30 pointer-events-none">
                            {t('gallery.label_after', 'DESPUÉS')}
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
