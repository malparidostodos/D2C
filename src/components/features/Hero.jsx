import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const containerRef = useRef(null)
  const { t, i18n } = useTranslation()

  const getLocalizedPath = (path) => {
    const prefix = i18n.language === 'en' ? '/en' : ''
    return `${prefix}${path}`
  }

  return (
    <section ref={containerRef} id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Logo - Top Left */}



      {/* Content */}
      <div className="w-full relative z-20 flex flex-col lg:flex-row items-start lg:items-end justify-between h-full pt-[100px] pb-[40px] lg:pt-[120px] lg:pb-[135px] px-6 md:px-[60px] gap-8 lg:gap-0">

        {/* Left Side: Title */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 lg:mb-6"
          >
            <span className="inline-block py-1 px-3 rounded-full border border-gray-200 bg-gray-100/50 backdrop-blur-sm text-[10px] lg:text-xs font-medium tracking-widest uppercase text-black">
              {t('hero.quality_guaranteed')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black tracking-tight leading-[1.1]"
            style={{
              textShadow: '0 0 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            {t('hero.title_part1')} <br /> {t('hero.title_part2')} <br /> {t('hero.title_part3')}
          </motion.h1>
        </div>

        {/* Right Side: Description & Buttons */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left mb-2 lg:mb-0 pl-0 lg:pl-20 xl:pl-40 pb-0 lg:pb-10">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lg md:text-2xl text-white font-medium mb-6 lg:mb-8 leading-tight"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto"
          >
            <AnimatedButton
              href={getLocalizedPath("/reserva")}
              variant="blur"
              className="w-full sm:w-auto justify-center"
            >
              {t('hero.cta_booking')}
            </AnimatedButton>

            <AnimatedButton
              href={getLocalizedPath("/precios")}
              variant="blur"
              className="w-full sm:w-auto justify-center"
              onClick={(e) => {
                const section = document.querySelector('#precios');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta_services')}
            </AnimatedButton>
          </motion.div>
        </div>
      </div>


    </section >
  )
}

export default Hero
