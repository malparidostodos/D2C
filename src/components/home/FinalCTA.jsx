import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, MessageCircle } from 'lucide-react'
import { useMenu } from '../../hooks/useMenu'
import { useTranslation } from 'react-i18next'

const FinalCTA = () => {
    const { getLocalizedPath, navigateWithTransition } = useMenu()
    const { t, i18n } = useTranslation()

    return (
        <section className="bg-white min-h-screen flex items-center justify-center px-4 relative overflow-hidden select-none">
            <div className="w-full max-w-[90rem] mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-8xl lg:text-9xl font-medium text-[#0046b8] mb-6 font-display tracking-tighter leading-none max-w-7xl mx-auto"
                >
                    <span className="block">{t('final_cta.title_line1')}</span>
                    <span className="block">{t('final_cta.title_line2')}</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-xl md:text-2xl font-normal text-[#0046b8]/60 mb-12 max-w-2xl mx-auto"
                >
                    {t('final_cta.subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to={getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva")}
                        onClick={(e) => {
                            e.preventDefault()
                            navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva"))
                        }}
                        className="group relative inline-flex items-center justify-center px-8 py-3 bg-transparent border border-[#0046b8]/30 text-[#0046b8] rounded-2xl font-semibold text-lg hover:border-[#0046b8] hover:bg-blue-50/50 transition-all duration-300 min-w-[200px]"
                    >
                        <Calendar className="mr-2 w-5 h-5" />
                        {t('button.book_now')}
                    </Link>

                    <a
                        href="https://wa.me/1234567890" // TODO: Add real number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-[#0046b8]/30 text-[#0046b8] rounded-2xl font-semibold text-lg hover:border-[#0046b8] hover:bg-blue-50/50 transition-all duration-300 min-w-[200px]"
                    >
                        <MessageCircle className="mr-2 w-5 h-5" />
                        {t('button.whatsapp')}
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default FinalCTA
