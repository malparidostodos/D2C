import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame, useScroll, useVelocity, useSpring, useTransform, useInView } from 'framer-motion'
import { Star, Quote, Clock, Car, Award, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data, error } = await supabase
                    .from('testimonials')
                    .select(`
                        *,
                        booking:bookings(
                            service:services(name)
                        )
                    `)
                    .eq('is_public', true)
                    .order('rating', { ascending: false })  // 5 stars first
                    .order('created_at', { ascending: false }) // Then most recent

                if (error) throw error

                if (data) {
                    // Smart mix: shuffle slightly to avoid exact repetition in infinite loop
                    const shuffled = [...data].sort(() => Math.random() - 0.5)
                    setTestimonials(shuffled)
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTestimonials()

        const subscription = supabase
            .channel('public:testimonials')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
                fetchTestimonials()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const [stats, setStats] = useState({
        hours: 500,
        vehicles: 50,
        fiveStar: 50,
        rating: 5.0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch from the public stats table
                const { data, error } = await supabase
                    .from('landing_stats')
                    .select('*')
                    .single()

                if (error) throw error

                if (data) {
                    setStats({
                        hours: data.hours || 0,
                        vehicles: data.vehicles || 0,
                        fiveStar: data.five_star || 0,
                        rating: Number(data.rating || 5).toFixed(1)
                    })
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            }
        }

        fetchStats()

        // Real-time subscription to the public stats table
        const subscription = supabase
            .channel('public:landing_stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'landing_stats' }, (payload) => {
                if (payload.new) {
                    setStats({
                        hours: payload.new.hours || 0,
                        vehicles: payload.new.vehicles || 0,
                        fiveStar: payload.new.five_star || 0,
                        rating: Number(payload.new.rating || 5).toFixed(1)
                    })
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])



    // Infinite Scroll Logic with Drag
    const baseVelocity = -1 // Increased speed (was -0.5)
    const x = useMotionValue(0)
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [contentWidth, setContentWidth] = useState(0)

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth)
            // Estimate content width: (Card Width + Gap) * Number of Items
            // Card width approx 400px (md) or 350px (base), Gap 32px (gap-8)
            const cardWidth = window.innerWidth >= 768 ? 400 : 350
            const gap = 32
            setContentWidth(testimonials.length * (cardWidth + gap))
        }
    }, [testimonials.length])

    const directionFactor = useRef(1)

    useAnimationFrame((t, delta) => {
        if (!contentWidth) return

        let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 60 // Normalize to 60fps

        let newX = x.get() + moveBy

        // Wrap logic
        if (newX <= -contentWidth) {
            newX = 0
        } else if (newX > 0) {
            newX = -contentWidth
        }

        x.set(newX)
    })

    // Loading skeleton
    if (loading) {
        return (
            <section className="bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                    <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                        <div className="text-center mb-16 px-4 relative z-10">
                            <div className="h-8 w-48 bg-white/20 rounded-lg mx-auto mb-6 animate-pulse" />
                            <div className="h-12 w-96 bg-white/20 rounded-lg mx-auto animate-pulse" />
                        </div>
                        <div className="flex gap-8 overflow-hidden relative z-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-[350px] md:w-[400px] flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 animate-pulse">
                                    <div className="flex gap-1 mb-6">
                                        {[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-4 h-4 bg-white/20 rounded" />)}
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        <div className="h-4 bg-white/20 rounded w-full" />
                                        <div className="h-4 bg-white/20 rounded w-3/4" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-full" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-white/20 rounded w-24 mb-2" />
                                            <div className="h-3 bg-white/20 rounded w-32" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (error) {
        return (
            <section className="bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                    <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                        <div className="text-center py-20 relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3">No pudimos cargar las reseñas</h3>
                            <p className="text-white/60 mb-8">Por favor, intenta recargar la página</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }



    return (
        <section className="bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container with subtle gradient */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                    {/* Subtle vertical gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                    <div className="text-center mb-16 px-4">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-white/60 text-sm font-semibold tracking-widest uppercase mb-4 block"
                        >
                            Reseñas
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-semibold text-white mb-6"
                        >
                            Lo que dicen nuestros <span className="text-white/80">Clientes</span>
                        </motion.h2>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative w-full overflow-hidden mb-24" ref={containerRef}>
                        {testimonials.length === 0 ? (
                            /* Empty state placeholder */
                            <div className="text-center py-20 relative z-10">
                                <Star className="w-16 h-16 text-white/40 mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold text-white mb-3">Próximamente</h3>
                                <p className="text-white/60">Estamos recopilando las primeras reseñas de nuestros clientes</p>
                            </div>
                        ) : (
                            <>
                                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0046b8] to-transparent z-10 pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0046b8] to-transparent z-10 pointer-events-none" />

                                <motion.div
                                    className="flex gap-8 px-4 py-12 cursor-grab active:cursor-grabbing"
                                    style={{ x, width: "max-content" }}
                                    drag="x"
                                    dragConstraints={{ left: -contentWidth, right: 0 }}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        if (offset.x > 0) {
                                            directionFactor.current = -1
                                        } else {
                                            directionFactor.current = 1
                                        }
                                        directionFactor.current = 1
                                    }}
                                >
                                    {/* Render items multiple times to ensure seamless loop coverage */}
                                    {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                                        <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Stats Section */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {[
                                    { number: stats.hours, label: "Horas de Trabajo", icon: Clock },
                                    { number: stats.vehicles, label: "Vehículos Detallados", icon: Car },
                                    { number: stats.fiveStar, label: "Reseñas 5 Estrellas", icon: Award },
                                    { number: stats.rating, label: "Calificación Promedio", icon: TrendingUp, hasStar: true }
                                ].map((stat, index) => (
                                    <StatItem key={index} stat={stat} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// StatItem component with count-up animation
const StatItem = ({ stat, index }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (isInView) {
            const isDecimal = stat.number.toString().includes('.')
            const targetValue = parseFloat(stat.number)
            const duration = 2000 // 2 seconds
            const steps = 60
            const increment = targetValue / steps
            const stepDuration = duration / steps

            let currentStep = 0
            const timer = setInterval(() => {
                currentStep++
                if (currentStep >= steps) {
                    setCount(targetValue)
                    clearInterval(timer)
                } else {
                    setCount(prev => Math.min(prev + increment, targetValue))
                }
            }, stepDuration)

            return () => clearInterval(timer)
        }
    }, [isInView, stat.number])

    const displayValue = stat.number.toString().includes('.')
        ? count.toFixed(1)
        : Math.floor(count)

    const IconComponent = stat.icon

    return (
        <div ref={ref} className="flex flex-col items-center text-center px-4">
            <IconComponent className="w-7 h-7 text-[#0046b8]/40 mb-3" />
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl md:text-6xl font-semibold text-[#0046b8]">
                    {displayValue}
                </span>
                {stat.hasStar && <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 fill-yellow-500" />}
            </div>
            <span className="text-[#0046b8]/70 font-bold uppercase tracking-wider text-sm md:text-base">
                {stat.label}
            </span>
        </div>
    )
}

const TestimonialCard = ({ testimonial }) => {
    const [showTooltip, setShowTooltip] = React.useState(false)

    // Capitalize first letter of review content
    const capitalizeFirst = (text) => {
        if (!text) return text
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return (
        <div className="w-[350px] md:w-[400px] flex-shrink-0 bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 hover:-translate-y-[4px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.24)] transition-all duration-200 ease-out relative group shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            {/* Quote icon - background decoration */}
            <div className="absolute top-8 right-8 text-white/[0.08] group-hover:text-white/[0.15] transition-colors duration-200">
                <Quote size={36} />
            </div>

            {/* Stars with glow effect */}
            <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className="text-yellow-400 fill-yellow-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(250,204,21,0.6)] transition-all duration-200"
                        style={{ transitionDelay: `${i * 30}ms` }}
                    />
                ))}
            </div>

            {/* Review text - enhanced readability */}
            <p className="text-white text-base mb-8 leading-[1.6] break-words line-clamp-2 font-medium translate-y-[-2px]">
                {capitalizeFirst(testimonial.content)}
            </p>

            {/* Avatar and name section */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={testimonial.avatar_url || testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0046b8&color=fff`}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full border-2 border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.3)] object-cover group-hover:border-blue-400/60 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] transition-all duration-200"
                    />
                    {/* Animated border ring on hover */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-300/0 group-hover:border-blue-300/30 group-hover:scale-110 transition-all duration-200 ease-out" />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-white font-semibold translate-y-[-1px]">
                            {testimonial.name.split(' ')[0].charAt(0).toUpperCase() + testimonial.name.split(' ')[0].slice(1).toLowerCase()}
                        </h4>
                        {/* Verified check with tooltip */}
                        <div
                            className="relative flex items-center gap-1 text-blue-200/80 text-xs"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded whitespace-nowrap backdrop-blur-sm">
                                    Cliente verificado
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-black/80" />
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-blue-100/60 text-xs font-medium translate-y-[1px]">
                        {testimonial.booking?.service?.name || 'Cliente verificado'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Testimonials
