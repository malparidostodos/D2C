import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'

const Pricing = () => {
    const { t, i18n } = useTranslation()

    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : ''
        return `${prefix}${path}`
    }

    const plans = [
        {
            name: t('pricing.plans.basic.name'),
            description: t('pricing.plans.basic.description'),
            price: '50.000',
            period: '/mes',
            features: t('pricing.plans.basic.features', { returnObjects: true }),
            highlight: false
        },
        {
            name: t('pricing.plans.premium.name'),
            description: t('pricing.plans.premium.description'),
            price: '300.000',
            period: '/mes',
            features: t('pricing.plans.premium.features', { returnObjects: true }),
            highlight: true
        },
        {
            name: t('pricing.plans.elite.name'),
            description: t('pricing.plans.elite.description'),
            price: '1.000.000',
            period: '/mes',
            features: t('pricing.plans.elite.features', { returnObjects: true }),
            highlight: false
        }
    ]

    return (
        <section id="membresias" className="py-16 md:py-32 bg-[#0046b8] relative overflow-hidden">
            <div className="container relative z-10 px-4 md:px-6">


                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group p-6 md:p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                ? 'bg-white border-white shadow-2xl scale-105 z-10'
                                : 'bg-white/90 border-white/50 hover:bg-white hover:border-white hover:shadow-xl'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0046b8] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    {t('pricing.most_popular')}
                                </div>
                            )}

                            <div className="mb-6 md:mb-8 text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6 md:mb-8 flex items-baseline justify-center gap-1">
                                <span className="text-3xl md:text-4xl font-light text-gray-900">$</span>
                                <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{plan.price}</span>
                                <span className="text-gray-500 ml-2">{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-8 md:mb-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start justify-center gap-3 text-gray-600 text-left">
                                        <div className="mt-1 p-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <AnimatedButton
                                className="w-full justify-center"
                                variant={plan.highlight ? 'primary' : 'outline'}
                                href={getLocalizedPath("/contacto")}
                                onClick={(e) => {
                                    const section = document.querySelector('#contacto');
                                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {t('pricing.choose_plan')}
                            </AnimatedButton>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing
