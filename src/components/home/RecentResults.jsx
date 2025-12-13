import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMenu } from '../../hooks/useMenu'

// Interactive Before/After Card with Drag Slider
const BeforeAfterCard = ({ before, after, label, delay, details, benefits, t }) => {
    const [isHovered, setIsHovered] = useState(false)
    const containerRef = useRef(null)
    const initialPosRef = useRef(50)
    const sliderX = useMotionValue(50) // Start at 50%
    const clipPath = useTransform(
        sliderX,
        value => `inset(0 ${100 - value}% 0 0)`
    )


    const handleDragStart = () => {
        initialPosRef.current = sliderX.get()
    }

    const handleDrag = (event, info) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const offsetPercentage = (info.offset.x / rect.width) * 100
        const newPercentage = initialPosRef.current + offsetPercentage
        const clampedPercentage = Math.max(0, Math.min(100, newPercentage))

        sliderX.set(clampedPercentage)
    }

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl shadow-blue-900/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Before Image (Background) */}
            <div className="absolute inset-0">
                <img src={before} alt="Antes" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-300 rounded-full" />
                    {t('recent_results.before')}
                </div>
            </div>

            {/* After Image (Overlay with clip-path) */}
            <motion.div
                className="absolute inset-0 select-none pointer-events-none"
                style={{ clipPath }}
            >
                <img src={after} alt="Después" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-300 rounded-full" />
                    {t('recent_results.after')}
                </div>
            </motion.div>

            {/* Draggable Slider with microinteractions */}
            <motion.div
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                className="absolute top-0 bottom-0 w-1 cursor-ew-resize z-20 active:shadow-2xl transition-shadow"
                style={{ left: useTransform(sliderX, value => `${value}%`) }}
            >
                <div className="absolute inset-0 bg-white/90 shadow-lg active:shadow-2xl transition-shadow" />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1.1 }}
                >
                    <div className="flex gap-1">
                        <div className="w-0.5 h-4 bg-gray-700" />
                        <div className="w-0.5 h-4 bg-gray-700" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Overlay with Info on Hover */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10"
            >
                <div className="text-center space-y-3 px-6">
                    {details?.map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-white/90">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm font-medium">{detail}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Label with context */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-5">
                <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
                {/* Human context lines */}
                <div className="space-y-1">
                    {benefits?.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                            <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span>{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const RecentResults = ({ embedded = false }) => {
    const { t, i18n } = useTranslation()
    const { getLocalizedPath, navigateWithTransition } = useMenu()

    const results = [
        {
            before: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
            label: t('recent_results.results.interior_renovation.label'),
            benefits: t('recent_results.results.interior_renovation.benefits', { returnObjects: true }),
            details: t('recent_results.results.interior_renovation.details', { returnObjects: true })
        },
        {
            before: "https://images.unsplash.com/photo-1595786195726-25925e064972?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1595786195709-32fb33c7f957?q=80&w=1000&auto=format&fit=crop",
            label: t('recent_results.results.paint_correction.label'),
            benefits: t('recent_results.results.paint_correction.benefits', { returnObjects: true }),
            details: t('recent_results.results.paint_correction.details', { returnObjects: true })
        },
        {
            before: "https://images.unsplash.com/photo-1625043484555-5f33465133b7?q=80&w=1000&auto=format&fit=crop",
            after: "https://images.unsplash.com/photo-1550983756-34351c221297?q=80&w=1000&auto=format&fit=crop",
            label: t('recent_results.results.wheel_detailing.label'),
            benefits: t('recent_results.results.wheel_detailing.benefits', { returnObjects: true }),
            details: t('recent_results.results.wheel_detailing.details', { returnObjects: true })
        }
    ]

    // If embedded, just return the grid without section wrapper
    if (embedded) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.map((item, index) => (
                    <BeforeAfterCard
                        key={index}
                        {...item}
                        delay={index * 0.1}
                        t={t}
                    />
                ))}
            </div>
        )
    }

    return (
        <section className="bg-[#0046b8] py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-12 text-center font-display"
                >
                    {t('recent_results.title')}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.map((item, index) => (
                        <BeforeAfterCard
                            key={index}
                            {...item}
                            delay={index * 0.1}
                            t={t}
                        />
                    ))}
                </div>

                {/* Dual CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
                >
                    <Link
                        to={getLocalizedPath(i18n.language === 'en' ? "/gallery" : "/galeria")}
                        onClick={(e) => {
                            e.preventDefault()
                            navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/gallery" : "/galeria"))
                        }}
                        className="inline-flex items-center justify-center px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                    >
                        {t('recent_results.cta_view_more')}
                    </Link>
                    <Link
                        to={getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva")}
                        onClick={(e) => {
                            e.preventDefault()
                            navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva"))
                        }}
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#0046b8] rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
                    >
                        {t('recent_results.cta_want_result')}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default RecentResults
