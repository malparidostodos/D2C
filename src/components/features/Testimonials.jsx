import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data, error } = await supabase
                    .from('testimonials')
                    .select('*')
                    .eq('is_public', true)
                    .eq('rating', 5) // Only 5-star reviews
                    .order('created_at', { ascending: false })
                // Removed limit to get all of them

                if (error) throw error

                if (data) {
                    setTestimonials(data)
                }
            } catch (error) {
                console.log('Error fetching testimonials:', error)
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

    if (!loading && testimonials.length === 0) {
        return null
    }

    return (
        <section className="bg-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
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
                    </div>

                    {/* Stats Section */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {[
                                    { number: stats.hours, label: "Horas de Trabajo" },
                                    { number: stats.vehicles, label: "Vehículos Detallados" },
                                    { number: stats.fiveStar, label: "Reseñas 5 Estrellas" },
                                    { number: stats.rating, label: "Calificación Promedio", hasStar: true }
                                ].map((stat, index) => (
                                    <div key={index} className={`flex flex-col items-center text-center ${index !== 3 ? 'md:border-r md:border-blue-100' : ''}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-5xl md:text-6xl font-semibold text-[#0046b8]">{stat.number}</span>
                                            {stat.hasStar && <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                        <span className="text-[#0046b8]/70 font-bold uppercase tracking-wider text-sm md:text-base">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const TestimonialCard = ({ testimonial }) => (
    <div className="w-[350px] md:w-[400px] flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 relative group shadow-lg">
        <div className="absolute top-8 right-8 text-white/20 group-hover:text-white/40 transition-colors">
            <Quote size={40} />
        </div>

        <div className="flex gap-1 mb-6">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
        </div>

        <p className="text-white mb-8 leading-relaxed min-h-[80px] break-words line-clamp-6 font-medium">
            {testimonial.content}
        </p>

        <div className="flex items-center gap-4">
            <img
                src={testimonial.avatar_url || testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
            />
            <div>
                <h4 className="text-white font-semibold">
                    {testimonial.name.split(' ')[0].charAt(0).toUpperCase() + testimonial.name.split(' ')[0].slice(1).toLowerCase()}
                </h4>
                <p className="text-blue-100/70 text-sm font-medium">{testimonial.role}</p>
            </div>
        </div>
    </div>
)

export default Testimonials
