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
import FeaturedServices from '../home/FeaturedServices'
import HowItWorks from '../home/HowItWorks'
import EmotionalSection from '../home/EmotionalSection'
import RecentResults from '../home/RecentResults'
// FinalCTA and Footer removed as they are in FooterZone

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

                {/* 2. Servicios Destacados (Preview) [NEW] */}
                <FeaturedServices />

                {/* 3. Por qué elegirnos (Benefits) */}
                <Benefits />

                {/* 4. Cómo funciona (3 pasos) [NEW] */}
                <HowItWorks />

                {/* 5. Sección Emocional [NEW] */}
                <EmotionalSection />

                {/* 6. Resultados Recientes [NEW] */}
                <RecentResults />

                {/* 7. Marcas (Collaboration) */}
                <Collaboration />

                {/* 8. Testimonios */}
                <Testimonials />

                {/* 9. Footer Zone */}
                <FooterZone />
            </main>
        </div>
    )
}

export default Home
