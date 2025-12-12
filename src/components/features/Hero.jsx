import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import AnimatedButton from '../ui/AnimatedButton'
import { useTranslation } from 'react-i18next'
import { useMenu } from '../../hooks/useMenu'

const Hero = () => {
  const containerRef = useRef(null)
  const { t, i18n } = useTranslation()
  const { navigateWithTransition } = useMenu()
  const { scrollY } = useScroll()

  // Optimized: Only animate car, not text
  const yCar = useTransform(scrollY, [0, 400], [0, 80])

  const getLocalizedPath = (path) => {
    const prefix = i18n.language === 'en' ? '/en' : ''
    return `${prefix}${path}`
  }

  return (
    <section ref={containerRef} id="inicio" className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">

      {/* Background Content - Centered */}
      <div className="relative z-10 w-full max-w-[1800px] px-4 flex flex-col items-center justify-center h-full">

        {/* Main Text Layer - Behind Car - Static for performance */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none select-none"
          style={{ willChange: 'transform' }}
        >
          {/* Top Text - Translated */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold text-[16vw] sm:text-[11vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] text-transparent text-stroke tracking-tight absolute top-[14%] md:top-[0%] z-0 px-4 text-center w-full"
          >
            {t('hero.text_top')}
          </motion.h1>

          {/* Mobile: Center layout, Desktop: Left position */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute z-0 w-full left-0 top-[32.5%] md:left-[11%] md:w-auto md:top-[28%]"
          >
            <span className="font-bold text-[16vw] sm:text-[12vw] md:text-[14vw] lg:text-[12vw] xl:text-[11vw] text-transparent text-stroke tracking-tighter leading-none block text-center md:text-left px-4 md:px-0">
              {t('hero.text_left')} <span className="md:hidden">{t('hero.text_right')}</span>
            </span>
          </motion.div>

          {/* Desktop only: Right text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block absolute z-0"
            style={{
              right: t('hero.positions.right.right'),
              top: t('hero.positions.right.top')
            }}
          >
            <span className="font-semibold text-[16vw] sm:text-[18vw] md:text-[14vw] lg:text-[12vw] xl:text-[11vw] text-transparent text-stroke tracking-tighter leading-none">
              {t('hero.text_right')}
            </span>
          </motion.div>

          {/* Bottom Text - Translated with dynamic position */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: -80 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-bold text-[14vw] sm:text-[11vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] text-transparent text-stroke tracking-tight absolute bottom-[39%] md:top-[49.2%] md:bottom-auto z-0 px-4 text-center w-full"
          >
            {t('hero.text_bottom')}
          </motion.h1>
        </div>

        {/* Car Image - Centered & Overlapping - Responsive sizing */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          style={{ y: yCar, willChange: 'transform' }}
          className="relative z-20 w-full max-w-[1100px] sm:max-w-[1300px] md:max-w-[1200px] lg:max-w-[1400px] mx-auto md:mr-[12%] md:ml-auto -mt-[20vh] sm:-mt-[25vh] md:-mt-[32vh]"
        >
          <img
            src="/images/porsche.png"
            alt="Porsche 911 GT3 RS"
            className="w-full h-auto object-contain"
            style={{
              filter: 'drop-shadow(0 0px 15px #0046b8) drop-shadow(0 0px 15px #0046b8) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))'
            }}
          />
          <style jsx>{`
            @media (min-width: 768px) {
              img {
                filter: drop-shadow(0 0px 30px #0046b8) drop-shadow(0 0px 30px #0046b8) drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4)) !important;
              }
            }
          `}</style>
        </motion.div>

        {/* Footer Controls - Bottom Center */}
        <div className="absolute bottom-10 md:bottom-12 left-0 w-full flex flex-col items-center z-30 gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white/90 text-center max-w-lg px-6 text-sm md:text-base font-medium leading-relaxed"
          >
            {t('hero.subtitle').split(',').map((part, index) => (
              <React.Fragment key={index}>
                {part}{index === 0 && ','}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex gap-4"
          >
            <AnimatedButton
              href={getLocalizedPath(i18n.language?.startsWith('en') ? "/booking" : "/reserva")}
              onClick={(e) => {
                e.preventDefault()
                navigateWithTransition(getLocalizedPath(i18n.language?.startsWith('en') ? "/booking" : "/reserva"))
              }}
              variant="white"
              className="min-w-[140px] justify-center"
            >
              {t('hero.cta_booking')}
            </AnimatedButton>
            <AnimatedButton
              href={getLocalizedPath(i18n.language?.startsWith('en') ? "/services" : "/servicios")}
              onClick={(e) => {
                e.preventDefault()
                navigateWithTransition(getLocalizedPath(i18n.language?.startsWith('en') ? "/services" : "/servicios"))
              }}
              variant="white"
              className="min-w-[140px] justify-center"
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