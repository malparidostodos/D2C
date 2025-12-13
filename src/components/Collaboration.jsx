import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './ui/AnimatedButton'
import { useTranslation } from 'react-i18next'
import { Award, ExternalLink } from 'lucide-react'

import { useMenu } from '../hooks/useMenu'

const Collaboration = () => {
  const { navigateWithTransition, getLocalizedPath } = useMenu()
  const { t } = useTranslation()
  const [hoveredBrand, setHoveredBrand] = useState(null)

  const scrollToSection = (e, sectionId, route) => {
    e.preventDefault()
    if (window.location.pathname !== '/') {
      navigateWithTransition('/')
      setTimeout(() => {
        const section = document.querySelector(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const section = document.querySelector(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Real brands used in professional detailing with value propositions
  const brands = [
    { name: "Meguiar's", short: "MGR", value: t('collaboration.brands.meguiars') },
    { name: "3M", short: "3M", value: t('collaboration.brands.3m') },
    { name: "Chemical Guys", short: "CG", value: t('collaboration.brands.chemical_guys') },
    { name: "Turtle Wax", short: "TW", value: t('collaboration.brands.turtle_wax') },
    { name: "Mothers", short: "MTH", value: t('collaboration.brands.mothers') },
    { name: "Gtechniq", short: "GTQ", value: t('collaboration.brands.gtechniq') },
    { name: "CarPro", short: "CPR", value: t('collaboration.brands.carpro') },
    { name: "Griot's", short: "GRT", value: t('collaboration.brands.griots') }
  ]

  const benefits = [
    {
      title: t('collaboration.items.premium_products.title'),
      description: t('collaboration.items.premium_products.description'),
      subtitle: t('collaboration.items.premium_products.subtitle')
    },
    {
      title: t('collaboration.items.professional_equipment.title'),
      description: "",
      subtitle: t('collaboration.items.professional_equipment.subtitle')
    },
    {
      title: t('collaboration.items.international_certifications.title'),
      description: "",
      subtitle: t('collaboration.items.international_certifications.subtitle')
    }
  ]

  return (
    <section id="colaboracion" className="min-h-screen flex items-center py-16 md:py-24 bg-white relative z-0 mt-0">
      <div className="container px-5">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium mb-4 select-none text-[#0046b8]">
              {t('collaboration.title_part1')}{' '}
              <span className="relative inline-block font-medium">
                {t('collaboration.title_part2')}
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10 T200,10" stroke="currentColor" strokeWidth="2" fill="none" className="text-[#0046b8]/30" />
                </svg>
              </span>
            </h2>

            {/* Anchor phrase */}
            <p className="text-gray-600 italic mb-8 text-sm md:text-base">
              "{t('collaboration.anchor_phrase')}"
            </p>

            {/* Certified Badge with subtle animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 6,
                  ease: "easeInOut"
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-[#D4AF37]">{t('collaboration.certified_badge')}</span>
            </motion.div>

            <ul className="space-y-6 mb-8">
              {benefits.map((benefit, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1 text-[#0046b8]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-1 select-none text-[#0046b8]">{benefit.title}</h6>
                    {benefit.description && <p className="text-gray-600 text-sm select-none mb-1">{benefit.description}</p>}
                    <p className="text-gray-500 text-xs italic">{benefit.subtitle}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Enhanced CTA */}
            <a
              href="/certificaciones"
              onClick={(e) => {
                e.preventDefault()
                // Placeholder for future certifications page
              }}
              className="inline-flex items-center gap-2 text-[#0046b8] hover:text-blue-700 font-semibold text-base transition-all group mt-2"
            >
              {t('collaboration.cta')} <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="relative text-[#0046b8] mt-12 md:mt-0">
            <motion.div
              className="relative w-full aspect-square max-w-[380px] md:max-w-md mx-auto"
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute inset-0 border border-blue-100 rounded-full"></div>
              <div className="absolute inset-8 border border-blue-100 rounded-full"></div>
              <div className="absolute inset-16 border border-blue-100 rounded-full"></div>


              {/* Real brands with hover */}
              {brands.map((brand, idx) => {
                const angle = (idx * 360) / 8 - 90
                const radius = 150
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.15 }}
                    onHoverStart={() => setHoveredBrand(brand.name)}
                    onHoverEnd={() => setHoveredBrand(null)}
                    className="absolute w-14 h-14 bg-white border-2 border-blue-100 rounded-xl flex items-center justify-center text-xs font-bold shadow-md hover:shadow-xl hover:border-[#0046b8] transition-all cursor-pointer select-none text-[#0046b8] group z-20"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span className="select-none group-hover:text-blue-700 transition-colors">{brand.short}</span>

                    {/* Rich tooltip with context */}
                    {hoveredBrand === brand.name && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg whitespace-nowrap shadow-2xl z-50 pointer-events-none min-w-[180px]">
                        <div className="font-semibold mb-0.5">{brand.name}</div>
                        <div className="text-gray-300 text-[10px]">{brand.value}</div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Counter-rotate star to keep it upright */}
            <motion.div
              className="absolute top-1/2 left-1/2"
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.9, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-28 h-28 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 z-10"
              >
                <div className="text-center">
                  <span className="text-4xl block mb-1">⭐</span>
                  <span className="text-[10px] font-semibold text-[#0046b8] tracking-wider">PREMIUM</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default Collaboration

