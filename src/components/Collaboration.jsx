import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'

const Collaboration = () => {
  const navigate = useNavigate()

  const scrollToSection = (e, sectionId, route) => {
    e.preventDefault()
    // Si estamos en una ruta diferente a /, navegar primero
    if (window.location.pathname !== '/') {
      navigate('/')
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

  return (
    <section id="colaboracion" className="py-24 bg-background relative">
      <div className="container px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 select-none text-white">
              Trabajamos con las mejores{' '}
              <span className="relative inline-block">
                marcas
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10 T200,10" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/30" />
                </svg>
              </span>
            </h2>

            <ul className="space-y-6 mb-8">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1 text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold mb-1 select-none text-white">Productos Premium</h6>
                  <p className="text-white/70 text-sm select-none">Trabajamos exclusivamente con las mejores marcas internacionales de productos para detailing.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1 text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold mb-1 select-none text-white">Equipamiento Profesional</h6>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1 text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold mb-1 select-none text-white">Certificaciones Internacionales</h6>
                </div>
              </li>
            </ul>

            <AnimatedButton
              href="/contacto"
              onClick={(e) => scrollToSection(e, '#contacto', '/contacto')}
            >
              Reserva tu cita
            </AnimatedButton>
          </div>

          <div className="relative text-white">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 border border-white/10 rounded-full"></div>
              <div className="absolute inset-8 border border-white/10 rounded-full"></div>
              <div className="absolute inset-16 border border-white/10 rounded-full"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>

              {['L', 'P', 'C', 'I', 'W', 'G', 'R', 'M'].map((letter, idx) => {
                const angle = (idx * 360) / 8 - 90
                const radius = 140
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <div
                    key={idx}
                    className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm select-none text-white"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <span className="select-none">{letter}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Collaboration

