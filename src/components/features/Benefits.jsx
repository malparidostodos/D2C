import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Shield, Zap, Sparkles, Scan, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Benefits = () => {
  const { t } = useTranslation()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // -- TIMELINE CONFIGURATION --
  // 0.00 - 0.20: Images Fly In (Cover Title)
  // 0.25: Intro Group starts moving UP immediately (Minimal pause)
  // 0.30: Text List starts entering

  // 1. Intro Group (Title + Images) Exit
  // Moves up completely to clear the screen. NO OPACITY FADE.
  const introGroupY = useTransform(scrollYProgress, [0.20, 0.45], ["0vh", "-120vh"])

  // Title Scale: Shrinks as images fly in (0-0.20) to stay behind/hidden
  const titleScale = useTransform(scrollYProgress, [0, 0.20], [1, 0.6])

  // 2. Flying Images Animation (Entrance)
  // Fly in faster (0 - 0.20) - Fine-tuned start values (Slightly earlier)
  const img1X = useTransform(scrollYProgress, [0, 0.20], ["-70vw", "-15vw"])
  const img1Y = useTransform(scrollYProgress, [0, 0.20], ["-75vh", "-10vh"])
  const img1Rot = useTransform(scrollYProgress, [0, 0.20], [-15, -5])
  const img1Op = useTransform(scrollYProgress, [0, 1], [1, 1])

  const img2X = useTransform(scrollYProgress, [0, 0.20], ["70vw", "15vw"])
  const img2Y = useTransform(scrollYProgress, [0, 0.20], ["-75vh", "-12vh"])
  const img2Rot = useTransform(scrollYProgress, [0, 0.20], [15, 5])
  const img2Op = useTransform(scrollYProgress, [0, 1], [1, 1])

  const img3X = useTransform(scrollYProgress, [0, 0.20], ["-70vw", "-11.5vw"])
  const img3Y = useTransform(scrollYProgress, [0, 0.20], ["75vh", "5vh"])
  const img3Rot = useTransform(scrollYProgress, [0, 0.20], [-10, -2])
  const img3Op = useTransform(scrollYProgress, [0, 1], [1, 1])

  const img4X = useTransform(scrollYProgress, [0, 0.20], ["70vw", "12vw"])
  const img4Y = useTransform(scrollYProgress, [0, 0.20], ["75vh", "8vh"])
  const img4Rot = useTransform(scrollYProgress, [0, 0.20], [10, 3])
  const img4Op = useTransform(scrollYProgress, [0, 1], [1, 1])

  const img5X = useTransform(scrollYProgress, [0, 0.20], ["0vw", "0vw"])
  const img5Y = useTransform(scrollYProgress, [0, 0.20], ["-95vh", "0vh"])
  const img5Rot = useTransform(scrollYProgress, [0, 0.20], [0, 0])
  const img5Scale = useTransform(scrollYProgress, [0, 0.20], [1.5, 1.1])
  const img5Op = useTransform(scrollYProgress, [0, 1], [1, 1])


  // 3. Text Items Sequence (The "Content" Layer)
  // They enter from off-screen bottom (100vh) without fading
  // Sequence starts earlier (0.30) to follow immediately after proper clustering

  const item1Y = useTransform(scrollYProgress, [0.16, 0.46], ["100vh", "0vh"])
  const item2Y = useTransform(scrollYProgress, [0.40, 0.56], ["100vh", "0vh"])
  const item3Y = useTransform(scrollYProgress, [0.50, 0.66], ["100vh", "0vh"])
  const item4Y = useTransform(scrollYProgress, [0.60, 0.76], ["100vh", "0vh"])

  // Common styles
  const iconContainerClass = "w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0046b8] flex items-center justify-center text-white shadow-lg shrink-0"
  const titleClass = "text-4xl md:text-7xl md:whitespace-nowrap font-display font-semibold text-[#0046b8] tracking-tight select-none text-center drop-shadow-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl"

  return (
    <section ref={containerRef} id="beneficios" className="relative h-[800vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* --- INTRO GROUP: TITLE + IMAGES --- */}
        {/* Moves UP and AWAY to reveal content below */}
        <motion.div
          style={{ y: introGroupY }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          {/* Title (No Fade, but Scales down) */}
          <motion.h2
            style={{ scale: titleScale }}
            className="absolute inset-0 flex items-center justify-center z-10 text-5xl md:text-8xl lg:text-9xl font-display font-semibold text-center text-[#0046b8] px-4 leading-tight origin-center select-none"
          >
            {t('benefits.why_choose_us')}
          </motion.h2>

          {/* Flying Images (No Fade) - Optimized with will-change and eager loading */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <motion.img
              src="/images/benefits/premiumquality.png"
              style={{ x: img1X, y: img1Y, rotate: img1Rot, willChange: "transform" }}
              loading="eager"
              decoding="async"
              className="absolute w-64 h-48 md:w-80 md:h-60 object-cover rounded-2xl shadow-xl backface-hidden"
            />
            <motion.img
              src="/images/benefits/ah.jpeg"
              style={{ x: img2X, y: img2Y, rotate: img2Rot, willChange: "transform" }}
              loading="eager"
              decoding="async"
              className="absolute w-60 h-44 md:w-80 md:h-56 object-cover rounded-2xl shadow-xl backface-hidden"
            />
            <motion.img
              src="/images/benefits/clean.png"
              style={{ x: img3X, y: img3Y, rotate: img3Rot, willChange: "transform" }}
              loading="eager"
              decoding="async"
              className="absolute w-64 h-48 md:w-80 md:h-60 object-cover rounded-2xl shadow-xl backface-hidden"
            />
            <motion.img
              src="/images/benefits/clean2.png"
              style={{ x: img4X, y: img4Y, rotate: img4Rot, willChange: "transform" }}
              loading="eager"
              decoding="async"
              className="absolute w-64 h-48 md:w-96 md:h-72 object-cover rounded-2xl shadow-xl backface-hidden"
            />
            <motion.img
              src="/images/benefits/jabon.png"
              style={{ x: img5X, y: img5Y, rotate: img5Rot, scale: img5Scale, willChange: "transform" }}
              loading="eager"
              decoding="async"
              className="absolute w-80 h-56 md:w-[450px] md:h-80 object-cover rounded-2xl shadow-2xl z-20 backface-hidden"
            />
          </div>
        </motion.div>


        {/* --- CONTENT LAYER: BENEFIT LIST --- */}
        {/* Enters from bottom (standard scroll feel) */}
        <div className="relative z-10 flex flex-col gap-8 md:gap-12 items-center justify-center w-full max-w-4xl px-4 pointer-events-none">

          {/* Item 1 */}
          <motion.div style={{ y: item1Y }} className="flex items-center gap-6 md:gap-8 w-full justify-center">
            <div className={iconContainerClass}>
              <Sparkles size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className={titleClass}>{t('benefits.items.premium_quality.title')}</h2>
          </motion.div>

          {/* Item 3 */}
          <motion.div style={{ y: item2Y }} className="flex items-center gap-6 md:gap-8 w-full justify-center">
            <div className={iconContainerClass}>
              <Shield size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className={titleClass}>{t('benefits.items.lasting_protection.title')}</h2>
          </motion.div>

          {/* Item 4 */}
          <motion.div style={{ y: item3Y }} className="flex items-center gap-6 md:gap-8 w-full justify-center">
            <div className={iconContainerClass}>
              <Scan size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className={titleClass}>{t('benefits.items.attention_to_detail.title')}</h2>
          </motion.div>

          {/* Item 5 */}
          <motion.div style={{ y: item4Y }} className="flex items-center gap-6 md:gap-8 w-full justify-center">
            <div className={iconContainerClass}>
              <UserCheck size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className={titleClass}>{t('benefits.items.personalized_service.title')}</h2>
          </motion.div>

        </div>

      </div>
    </section>
  )
}

export default Benefits