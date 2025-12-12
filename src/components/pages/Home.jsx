import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMenu } from '../../hooks/useMenu'

// Layout & UI
import Header from '../layout/Header'
import CustomScrollbar from '../ui/CustomScrollbar'
import SEO from '../ui/SEO'
import FooterZone from '../layout/FooterZone'

// Existing Sections
import Hero from '../features/Hero'
import Benefits from '../features/Benefits'
import Collaboration from '../Collaboration'
import Testimonials from '../features/Testimonials'

// New Sections
import PortfolioGallery from '../home/PortfolioGallery'
import FeaturedServices from '../home/FeaturedServices'
import HowItWorks from '../home/HowItWorks'

const Home = () => {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen text-primary relative">
            <SEO description={t('seo.home.description')} />
            <Header />
            <CustomScrollbar />

            <main>
                {/* 1. Hero Impactante */}
                <Hero />

                {/* 2. Galería de Trabajos Realizados */}
                <PortfolioGallery />

                {/* 3. Servicios Destacados (Preview) */}
                <FeaturedServices />

                {/* 4. Por qué elegirnos (Benefits) */}
                <Benefits />

                {/* 5. Cómo funciona (incluye: Emotional Section + Recent Results) */}
                <HowItWorks />

                {/* 6. Marcas (Collaboration) */}
                <Collaboration />

                {/* 7. Testimonios */}
                <Testimonials />

                {/* 8. Footer Zone */}
                <FooterZone />
            </main>
        </div>
    )
}

export default Home
