import React, { useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { TextReveal, FadeIn } from './TextReveal'

const services = [
  {
    id: '0',
    title: 'Lavado Premium',
    description: 'Limpieza profunda y detallada para mantener tu vehículo impecable.',
    price: 'Desde $50.000',
    features: ['Lavado exterior a mano', 'Aspirado profundo', 'Limpieza de vidrios', 'Hidratación de plásticos'],
    image: 'https://images.pexels.com/photos/6872159/pexels-photo-6872159.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '1',
    title: 'Coating Cerámico',
    description: 'Protección avanzada de larga duración con brillo extremo.',
    price: 'Desde $450.000',
    features: ['Protección 3-5 años', 'Efecto hidrofóbico', 'Resistencia a rayones', 'Brillo espejo'],
    image: 'https://images.pexels.com/photos/6872596/pexels-photo-6872596.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Corrección de Pintura',
    description: 'Eliminación de imperfecciones para restaurar la pintura original.',
    price: 'Desde $300.000',
    features: ['Eliminación de swirls', 'Corrección de marcas de agua', 'Restauración de color', 'Acabado show-car'],
    image: 'https://images.pexels.com/photos/4489734/pexels-photo-4489734.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Detailing Interior',
    description: 'Restauración y limpieza profunda de todos los componentes interiores.',
    price: 'Desde $150.000',
    features: ['Limpieza de tapicería', 'Vapor a alta presión', 'Hidratación de cuero', 'Eliminación de olores'],
    image: 'https://images.pexels.com/photos/627678/pexels-photo-627678.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
]

const ServiceCard = ({ service }) => {
  return (
    <div className="group relative h-[60vh] w-[85vw] md:w-[40vw] lg:w-[30vw] flex-shrink-0 overflow-hidden rounded-3xl bg-surface border border-white/10 transition-all duration-500 hover:border-accent/50">
      <div className="absolute inset-0">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-8">
        <div className="mb-auto pt-4">
          <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-sm border border-accent/20">
            Recomendado
          </span>
        </div>

        <h3 className="mb-2 text-3xl font-bold text-white">{service.title}</h3>
        <p className="mb-6 text-white/70">{service.description}</p>

        <div className="space-y-3 mb-8">
          {service.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
              <Check size={16} className="text-accent" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xl font-bold text-white">{service.price}</span>
          <button className="flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition-transform hover:scale-105">
            Reservar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

const Services = () => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

  return (
    <section ref={targetRef} id="servicios" className="relative h-[500vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-12 left-12 z-10 max-w-md">
          <FadeIn>
            <span className="text-accent font-medium tracking-widest uppercase text-sm">Nuestros Servicios</span>
          </FadeIn>
          <TextReveal
            text="Soluciones de Detailing"
            className="text-4xl md:text-5xl font-display font-bold text-white mt-2 mb-4"
          />
          <FadeIn delay={0.2}>
            <p className="text-white/60">
              Desliza para explorar nuestra gama completa de servicios diseñados para perfeccionar tu vehículo.
            </p>
          </FadeIn>
        </div>

        <motion.div style={{ x }} className="flex gap-8 pl-[5vw] md:pl-[40vw]">
          {services.map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
export default Services
