import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Collaboration from './components/Collaboration'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Roadmap from './components/Roadmap'
import Contact from './components/Contact'
import CustomScrollbar from './components/CustomScrollbar'

// Componente Home con todas las secciones
const Home = () => {
  return (
    <div className="min-h-screen bg-background text-primary relative">
      <Header />
      <CustomScrollbar />
      <main>
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
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

  useEffect(() => {
    const scrollToTarget = () => {
      if (sectionId === '#contacto') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      } else {
        const section = document.querySelector(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      // Clean URL
      setTimeout(() => {
        if (location.pathname !== '/') {
          navigate('/', { replace: true })
        }
      }, 1000)
    }

    setTimeout(scrollToTarget, 100)
  }, [sectionId, navigate, location.pathname])

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<ScrollToSection sectionId="#inicio" />} />
        <Route path="/beneficios" element={<ScrollToSection sectionId="#beneficios" />} />
        <Route path="/servicios" element={<ScrollToSection sectionId="#servicios" />} />
        <Route path="/roadmap" element={<ScrollToSection sectionId="#roadmap" />} />
        <Route path="/membresias" element={<ScrollToSection sectionId="#membresias" />} />
        <Route path="/contacto" element={<ScrollToSection sectionId="#contacto" />} />
        {/* Ruta catch-all para redirigir a home */}
        <Route path="*" element={<RedirectToHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

