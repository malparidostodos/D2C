import React from 'react'
import { useTranslation } from 'react-i18next'

// Layout & UI
import Header from '../layout/Header'
import CustomScrollbar from '../ui/CustomScrollbar'
import SEO from '../ui/SEO'

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
import FinalCTA from '../home/FinalCTA'

// Footer (Contact acts as footer)
import Contact from './Contact'

const Home = () => {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen text-primary relative">
            <SEO title={t('seo.home.title')} description={t('seo.home.description')} />
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

                {/* 9. CTA Final [NEW] */}
                <FinalCTA />

                {/* 10. Footer (Contact) */}
                <Contact />
            </main>
        </div>
    )
}

export default Home
