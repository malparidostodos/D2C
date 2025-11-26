import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Collaboration from './components/Collaboration'

import FlavorSection from './components/FlavorSection'
import Pricing from './components/Pricing'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import CustomScrollbar from './components/CustomScrollbar'
import SmoothScroll, { useSmoothScroll } from './components/SmoothScroll'
import BookingPage from './components/BookingPage'

// Componente Home con todas las secciones
const Home = () => {
  return (
    <div
      className="min-h-screen text-primary relative"
      style={{
        backgroundImage: "url('/images/BACKGROUND.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Header />
      <CustomScrollbar />
      <main>
        <Hero />
        <Benefits />
        <Collaboration />

        <FlavorSection />
        <Roadmap />
        <Pricing />
        <Contact />
      </main>
    </div>
  )
}

// Componente que maneja el scroll a secciones
const ScrollToSection = ({ sectionId }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { lenis } = useSmoothScroll()

  useEffect(() => {
    const scrollToTarget = () => {
      if (!lenis) return

      if (sectionId === '#contacto') {
        lenis.scrollTo(document.body.scrollHeight)
      } else {
        const section = document.querySelector(sectionId)
        if (section) {
          lenis.scrollTo(section)
        }
      }

      // Clean URL
      setTimeout(() => {
        if (location.pathname !== '/') {
          navigate('/', { replace: true })
        }
      }, 1000)
    }

    // Wait for lenis to be ready
    if (lenis) {
      // Small delay to ensure DOM is ready
      setTimeout(scrollToTarget, 100)
    }
  }, [sectionId, navigate, location.pathname, lenis])

  return <Home />
}

// Componente para redirigir rutas no válidas a home
const RedirectToHome = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return <Home />
}

const App = () => {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<ScrollToSection sectionId="#inicio" />} />
          <Route path="/beneficios" element={<ScrollToSection sectionId="#beneficios" />} />
          <Route path="/precios" element={<ScrollToSection sectionId="#precios" />} />
          <Route path="/roadmap" element={<ScrollToSection sectionId="#roadmap" />} />
          <Route path="/membresias" element={<ScrollToSection sectionId="#membresias" />} />
          <Route path="/contacto" element={<ScrollToSection sectionId="#contacto" />} />
          <Route path="/reserva" element={<BookingPage />} />
          <Route path="*" element={<RedirectToHome />} />
        </Routes>
      </BrowserRouter>
    </SmoothScroll>
  )
}

export default App

