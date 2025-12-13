import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Truck, Star, Check, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMenu } from '../../hooks/useMenu'
import RecentResults from './RecentResults'

const HowItWorks = () => {
    const { t, i18n } = useTranslation()
    const { getLocalizedPath, navigateWithTransition } = useMenu()

    const steps = [
        {
            icon: Calendar,
            title: t('how_it_works.steps.step1.title'),
            description: t('how_it_works.steps.step1.description')
        },
        {
            icon: Truck,
            title: t('how_it_works.steps.step2.title'),
            description: t('how_it_works.steps.step2.description')
        },
        {
            icon: Star,
            title: t('how_it_works.steps.step3.title'),
            description: t('how_it_works.steps.step3.description')
        }
    ]

    return (
        <section className="bg-white pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-20 -mt-[100vh]">
            <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
                {/* Blue Card Container with subtle gradient */}
                <div className="bg-[#0046b8] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                    {/* Subtle vertical gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                    {/* How It Works Section */}
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-4"
                        >
                            {t('how_it_works.title')}
                        </motion.h2>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            {t('how_it_works.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative mb-24">
                        {/* Animated Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 z-0">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/60 to-white/0"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                style={{ transformOrigin: "left" }}
                            />
                        </div>

                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 shadow-xl shadow-blue-900/20 border border-white/20 group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
                                    <step.icon className="w-12 h-12 text-white group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-white/90 transition-colors">{step.title}</h3>
                                <p className="text-white/80 group-hover:text-white/90 leading-relaxed max-w-xs transition-colors">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detail Level Section with Visual Bullets */}
                    <div className="text-center mb-24 py-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight"
                        >
                            {t('how_it_works.bottom_title')}
                        </motion.h2>

                        {/* Visual Bullets */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10"
                        >
                            {[
                                { icon: Check, text: t('how_it_works.visual_bullets.premium_products') },
                                { icon: Shield, text: t('how_it_works.visual_bullets.real_protection') },
                                { icon: Sparkles, text: t('how_it_works.visual_bullets.visible_results') }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-center gap-3 text-white/90">
                                    <item.icon className="w-5 h-5 text-white flex-shrink-0" />
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Dual CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                to={getLocalizedPath(i18n.language === 'en' ? "/services" : "/servicios")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/services" : "/servicios"))
                                }}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#0046b8] rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
                            >
                                {t('how_it_works.cta_view_services')}
                            </Link>
                            <Link
                                to={getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva")}
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva"))
                                }}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                            >
                                {t('how_it_works.cta_book_now')}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Recent Results - Integrated */}
                    <div className="mb-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white mb-12 text-center"
                        >
                            {t('recent_results.title')}
                        </motion.h2>

                        <RecentResults embedded={true} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
