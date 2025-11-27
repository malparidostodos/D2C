import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import AnimatedButton from './AnimatedButton'

const Hero = () => {
  const containerRef = useRef(null)


  return (
    <section ref={containerRef} id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Logo - Top Left */}



      {/* Content */}
      <div className="w-full relative z-20 flex flex-col lg:flex-row items-end justify-between h-full pt-[120px] pb-[135px] px-[60px] gap-10 lg:gap-0">

        {/* Left Side: Title */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 rounded-full border border-gray-200 bg-gray-100/50 backdrop-blur-sm text-xs font-medium tracking-widest uppercase text-black">
              Calidad Garantizada
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black tracking-tight leading-[1.1]"
            style={{
              textShadow: '0 0 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            Cuidado <br /> Automotriz <br /> Premium
          </motion.h1>
        </div>

        {/* Right Side: Description & Buttons */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left mb-2 lg:mb-0 pl-0 lg:pl-80 pb-10">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-xl md:text-2xl text-white font-medium mb-8 leading-tight"
          >
            Transformamos vehículos en obras de arte. Experimenta el cuidado automotriz llevado al nivel de la perfección.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-black sm:flex-row gap-4 items-center -mt-6"
          >
            <AnimatedButton
              href="/reserva"
              variant="blur"
            >
              Reserva tu Cita
            </AnimatedButton>

            <AnimatedButton
              href="/precios"
              variant="blur"
              onClick={(e) => {
                const section = document.querySelector('#precios');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Servicios
            </AnimatedButton>
          </motion.div>
        </div>
      </div>


    </section >
  )
}

export default Hero
