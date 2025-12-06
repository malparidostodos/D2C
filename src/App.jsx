import React, { useEffect } from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Hero from './components/features/Hero'
import Benefits from './components/features/Benefits'
import Collaboration from './components/Collaboration'

import FlavorSection from './components/features/FlavorSection'
import Pricing from './components/features/Pricing'
import ProcessPage from './components/pages/ProcessPage';

import Contact from './components/pages/Contact'
import CustomScrollbar from './components/ui/CustomScrollbar'
import SmoothScroll, { useSmoothScroll } from './components/ui/SmoothScroll'
import { MenuProvider } from './hooks/useMenu.jsx'
import BookingPage from './components/pages/BookingPage'
import ServicesPage from './components/pages/ServicesPage'
import MembershipsPage from './components/pages/MembershipsPage'
import RateService from './components/dashboard/RateService'

import LoginPage from './components/auth/LoginPage'

import SignUpPage from './components/auth/SignUpPage'

import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import UserDashboard from './components/dashboard/UserDashboard'
import ProfilePage from './components/dashboard/ProfilePage'
import AdminDashboard from './components/dashboard/AdminDashboard'

import Testimonials from './components/features/Testimonials'
import UserReviews from './components/dashboard/UserReviews'

import LanguageWrapper from './components/layout/LanguageWrapper'
import DashboardLayout from './components/layout/DashboardLayout'
import { useTranslation } from 'react-i18next'

import CookiePolicy from './components/legal/CookiePolicy'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import TermsConditions from './components/legal/TermsConditions'
import Disclaimers from './components/legal/Disclaimers'
import FAQ from './components/pages/FAQ'

import SEO from './components/ui/SEO'
import InteractiveGradient from './components/ui/InteractiveGradient/InteractiveGradient'
import FPSCounter from './components/ui/FPSCounter'

// Componente Home con todas las secciones
const Home = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen text-primary relative">
      <SEO title={t('seo.home.title')} description={t('seo.home.description')} />
      <Header />
      <CustomScrollbar />
      <main>
        <Hero />
        <Benefits />
        <Collaboration />

        <Collaboration />

        <Testimonials />
        <Contact />
      </main>
    </div>
  )
}

// Componente que maneja el scroll a secciones
const ScrollToSection = ({ sectionId, title, description }) => {
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

      // URL cleaning removed to persist SEO title and URL
    }

    // Wait for lenis to be ready
    if (lenis) {
      // Small delay to ensure DOM is ready
      setTimeout(scrollToTarget, 100)
    }
  }, [sectionId, navigate, location.pathname, lenis, i18n.language])

  return (
    <>
      {title && <SEO title={title} description={description} />}
      <Home />
    </>
  )
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

import PublicRoute from './components/auth/PublicRoute'

const AppRoutes = ({ t }) => {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="inicio" element={<ScrollToSection sectionId="#inicio" title={t('header.home')} />} />
      <Route path="beneficios" element={<ScrollToSection sectionId="#beneficios" title={t('benefits.title')} />} />
      <Route path="precios" element={<ScrollToSection sectionId="#precios" title={t('header.pricing')} />} />
      <Route path="roadmap" element={<ProcessPage />} />
      <Route path="membresias" element={<MembershipsPage />} />

      <Route path="services" element={<ServicesPage />} />
      <Route path="reserva" element={<BookingPage />} />


      {/* Public Only Routes (Redirect to Dashboard if logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="reset-password" element={<LanguageWrapper><ResetPasswordPage /></LanguageWrapper>} />

      {/* Dashboard Routes with Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="rate-service/:bookingId" element={<RateService />} />
        <Route path="reviews" element={<UserReviews />} />
      </Route>

      {/* Legal Routes */}
      <Route path="cookie-policy" element={<CookiePolicy />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-conditions" element={<TermsConditions />} />
      <Route path="disclaimers" element={<Disclaimers />} />
      <Route path="faq" element={<FAQ />} />

      <Route path="*" element={<RedirectToHome />} />
    </>
  )
}

import ScrollToTop from './components/ui/ScrollToTop'

const App = () => {
  const { t } = useTranslation()
  return (
    <SmoothScroll>
      <Toaster position="top-right" theme="dark" richColors />
      <FPSCounter />
      <div className="relative z-10">
        <BrowserRouter>
          <ScrollToTop />
          <InteractiveGradient />
          <MenuProvider>
            <Routes>
              {/* English Routes */}
              <Route path="/en" element={<LanguageWrapper language="en" />}>
                {AppRoutes({ t })}
              </Route>

              {/* Default (Spanish) Routes */}
              <Route path="/" element={<LanguageWrapper language="es" />}>
                {AppRoutes({ t })}
              </Route>
            </Routes>
          </MenuProvider>
        </BrowserRouter>
      </div>
    </SmoothScroll>
  )
}

export default App

