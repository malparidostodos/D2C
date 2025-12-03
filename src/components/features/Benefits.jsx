import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Shield, Star, Zap, Sparkles, Calendar, ShieldCheck, Smile } from 'lucide-react'
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
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Animation Ranges
  // 0.0 - 0.3: Title visible, then fades out
  // 0.2 - 0.4: Item 1 fades in (OVERLAP START)
  // 0.45 - 0.65: Item 2 fades in
  // 0.7 - 0.9: Item 3 fades in
  // 0.9 - 1.0: All visible (short locked state)

  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0])
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.7])
  const titleFilter = useTransform(scrollYProgress, [0.3, 0.4], ["blur(0px)", "blur(10px)"])

  const item1Opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])
  const item1Y = useTransform(scrollYProgress, [0.2, 0.5], ["100vh", "0vh"])

  const item2Opacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1])
  const item2Y = useTransform(scrollYProgress, [0.45, 0.75], ["100vh", "0vh"])

  const item3Opacity = useTransform(scrollYProgress, [0.7, 1.0], [0, 1])
  const item3Y = useTransform(scrollYProgress, [0.7, 1.0], ["100vh", "0vh"])

  return (
    <section ref={containerRef} id="beneficios" className="relative bg-white h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Title Layer */}
        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale, filter: titleFilter }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <h2 className="text-4xl md:text-8xl lg:text-9xl font-display font-bold text-[#0046b8] leading-tight tracking-tight text-center px-4 select-none">
            {t('benefits.why_choose_us')}
          </h2>
        </motion.div>

        {/* Items Stack Layer */}
        <div className="relative z-20 flex flex-col gap-8 md:gap-12 items-center justify-center w-full max-w-4xl px-4">
          {/* Item 1 */}
          <motion.div
            style={{ opacity: item1Opacity, y: item1Y }}
            className="flex items-center gap-6 md:gap-8 w-full justify-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0046b8] flex items-center justify-center text-white shadow-lg shrink-0">
              <Calendar size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-[#0046b8] tracking-tight select-none">
              {t('benefits.steps.book')}
            </h2>
          </motion.div>

          {/* Item 2 */}
          <motion.div
            style={{ opacity: item2Opacity, y: item2Y }}
            className="flex items-center gap-6 md:gap-8 w-full justify-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0046b8] flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-[#0046b8] tracking-tight select-none">
              {t('benefits.steps.trust')}
            </h2>
          </motion.div>

          {/* Item 3 */}
          <motion.div
            style={{ opacity: item3Opacity, y: item3Y }}
            className="flex items-center gap-6 md:gap-8 w-full justify-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0046b8] flex items-center justify-center text-white shadow-lg shrink-0">
              <Smile size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-[#0046b8] tracking-tight select-none">
              {t('benefits.steps.enjoy')}
            </h2>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default Benefits
