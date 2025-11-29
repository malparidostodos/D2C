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
        <section id="membresias" className="py-16 md:py-32 bg-background relative overflow-hidden">
            <div className="container relative z-10 px-4 md:px-6">
                <div className="text-center mb-12 md:mb-20">
                    <span className="text-accent font-medium tracking-widest uppercase text-xs md:text-sm">{t('pricing.exclusive_plans')}</span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-4 mb-4 md:mb-6">
                        {t('pricing.memberships')}
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg font-light">
                        {t('pricing.subtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group p-6 md:p-8 rounded-3xl border transition-all duration-300 ${plan.highlight
                                ? 'bg-white/10 border-white/20'
                                : 'bg-surface border-white/5 hover:border-white/10'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                    {t('pricing.most_popular')}
                                </div>
                            )}

                            <div className="mb-6 md:mb-8">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/40 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6 md:mb-8 flex items-baseline gap-1">
                                <span className="text-3xl md:text-4xl font-light text-white">$</span>
                                <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                                <span className="text-white/40 ml-2">{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-8 md:mb-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-white/70">
                                        <div className="mt-1 p-0.5 rounded-full bg-white/10 text-white">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <AnimatedButton
                                className="w-full justify-center"
                                variant={plan.highlight ? 'accent' : 'outline'}
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
