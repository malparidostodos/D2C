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

import LoginPage from './components/LoginPage'

import SignUpPage from './components/SignUpPage'

import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import UserDashboard from './components/UserDashboard'
import ProfilePage from './components/ProfilePage'
import AdminDashboard from './components/AdminDashboard'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'

import LanguageWrapper from './components/LanguageWrapper'
import { useTranslation } from 'react-i18next'

// Componente Home con todas las secciones
const Home = () => {
  return (
    <div className="min-h-screen text-primary relative">
      <Header />
      <CustomScrollbar />
      <main>
        <Hero />
        <Benefits />
        <Collaboration />

        <FlavorSection />
        <Gallery />
        <Roadmap />
        <Testimonials />
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
  const { i18n } = useTranslation()

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
      const currentLang = i18n.language === 'en' ? '/en' : ''
      const targetPath = currentLang || '/'

      setTimeout(() => {
        if (location.pathname !== targetPath) {
          navigate(targetPath, { replace: true })
        }
      }, 1000)
    }

    // Wait for lenis to be ready
    if (lenis) {
      // Small delay to ensure DOM is ready
      setTimeout(scrollToTarget, 100)
    }
  }, [sectionId, navigate, location.pathname, lenis, i18n.language])

  return <Home />
}

// Componente para redirigir rutas no válidas a home
const RedirectToHome = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  useEffect(() => {
    const targetPath = i18n.language === 'en' ? '/en' : '/'
    navigate(targetPath, { replace: true })
  }, [navigate, i18n.language])

  return <Home />
}

const AppRoutes = () => (
  <>
    <Route index element={<Home />} />
    <Route path="inicio" element={<ScrollToSection sectionId="#inicio" />} />
    <Route path="beneficios" element={<ScrollToSection sectionId="#beneficios" />} />
    <Route path="precios" element={<ScrollToSection sectionId="#precios" />} />
    <Route path="roadmap" element={<ScrollToSection sectionId="#roadmap" />} />
    <Route path="membresias" element={<ScrollToSection sectionId="#membresias" />} />
    <Route path="contacto" element={<ScrollToSection sectionId="#contacto" />} />
    <Route path="reserva" element={<BookingPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUpPage />} />
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="admin" element={<AdminDashboard />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="reset-password" element={<ResetPasswordPage />} />
    <Route path="*" element={<RedirectToHome />} />
  </>
)

const App = () => {
  return (
    <SmoothScroll>
      <div
        style={{
          backgroundImage: "url('/images/BG2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* English Routes */}
            <Route path="/en" element={<LanguageWrapper language="en" />}>
              {AppRoutes()}
            </Route>

            {/* Default (Spanish) Routes */}
            <Route path="/" element={<LanguageWrapper language="es" />}>
              {AppRoutes()}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </SmoothScroll>
  )
}

export default App

