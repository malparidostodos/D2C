import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

const processSteps = [
  {
    id: '0',
    title: 'Evaluación Inicial',
    description: 'Inspección detallada del vehículo para identificar imperfecciones y determinar el mejor tratamiento.',
    date: 'Paso 1',
    status: 'done',
  },
  {
    id: '1',
    title: 'Descontaminación',
    description: 'Limpieza profunda química y mecánica para eliminar contaminantes adheridos a la pintura.',
    date: 'Paso 2',
    status: 'done',
  },
  {
    id: '2',
    title: 'Corrección de Pintura',
    description: 'Proceso de pulido en múltiples etapas para eliminar rayas, marcas de agua y restaurar el brillo.',
    date: 'Paso 3',
    status: 'current',
  },
  {
    id: '3',
    title: 'Protección Cerámica',
    description: 'Aplicación de recubrimiento cerámico para proteger la pintura y facilitar la limpieza futura.',
    date: 'Paso 4',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Curado y Entrega',
    description: 'Tiempo de curado bajo lámparas IR y revisión final antes de la entrega al cliente.',
    date: 'Paso 5',
    status: 'upcoming',
  },
]

const ProcessCard = ({ step, index, totalSteps, scrollProgress }) => {
  const isEven = index % 2 === 0
  const circleRef = useRef(null)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)

  // Calculate position
  const stepProgress = index / (totalSteps - 1)

  // Reached: Line has reached or passed the circle (going down)
  // Adjusted threshold to be tighter (0.02) for better precision
  const hasReached = scrollProgress >= stepProgress - 0.02

  // Track when it's been seen
  React.useEffect(() => {
    if (hasReached && !hasBeenSeen) {
      setHasBeenSeen(true)
    }
  }, [hasReached, hasBeenSeen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`flex items-center justify-between w-full mb-8 ${isEven ? 'flex-row-reverse' : ''}`}
    >
      <div className="hidden md:block w-5/12" />

      {/* Dynamic Circle with Check Animation */}
      <div
        ref={circleRef}
        className="z-20 flex items-center justify-center w-10 h-10 bg-surface border border-white/10 rounded-full shadow-xl"
      >
        {hasBeenSeen ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2
              className={`w-6 h-6 transition-colors duration-300 ${hasReached ? 'text-accent' : 'text-white/40'}`}
            />
          </motion.div>
        ) : (
          <Circle className="w-6 h-6 text-white/20" />
        )}
      </div>

      <div className="w-full md:w-5/12 pl-4 md:pl-0">
        <div className="p-6 bg-surface border border-white/10 rounded-2xl hover:border-accent/50 transition-colors duration-300">
          <span className="text-accent text-sm font-bold tracking-wider uppercase mb-2 block">
            {step.date}
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
          <p className="text-white/60 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const Roadmap = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  })

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll progress for all cards
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <section ref={containerRef} id="roadmap" className="py-32 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <span className="text-accent font-medium tracking-widest uppercase text-sm">Nuestro Método</span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mt-4 mb-6">
            Proceso de Transformación
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          <motion.div
            style={{ height }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-accent -translate-x-1/2 origin-top"
          />

          <div className="flex flex-col gap-12">
            {processSteps.map((step, index) => (
              <ProcessCard
                key={step.id}
                step={step}
                index={index}
                totalSteps={processSteps.length}
                scrollProgress={scrollProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Roadmap
