import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Star, Zap, Clock, Award, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BenefitCard = ({ benefit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl bg-surface border border-white/10 group ${benefit.className}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
        <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
          <benefit.icon size={24} className="text-white" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
          <p className="text-white/60 group-hover:text-white/90 transition-colors duration-300">
            {benefit.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const Benefits = () => {
  const { t } = useTranslation()

  const benefits = [
    {
      id: '0',
      title: t('benefits.items.premium_quality.title'),
      description: t('benefits.items.premium_quality.description'),
      icon: Star,
      className: 'md:col-span-2',
      image: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '1',
      title: t('benefits.items.lasting_protection.title'),
      description: t('benefits.items.lasting_protection.description'),
      icon: Shield,
      className: 'md:col-span-1',
      image: 'https://images.pexels.com/photos/6872596/pexels-photo-6872596.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: t('benefits.items.advanced_technology.title'),
      description: t('benefits.items.advanced_technology.description'),
      icon: Zap,
      className: 'md:col-span-1',
      image: 'https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      title: t('benefits.items.attention_to_detail.title'),
      description: t('benefits.items.attention_to_detail.description'),
      icon: Sparkles,
      className: 'md:col-span-2',
      image: 'https://images.pexels.com/photos/627678/pexels-photo-627678.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
  ]

  return (
    <section id="beneficios" className="py-32 bg-background relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-accent font-medium tracking-widest uppercase text-sm">{t('benefits.why_choose_us')}</span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mt-4 mb-6 justify-center">
              {t('benefits.title')}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {t('benefits.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
