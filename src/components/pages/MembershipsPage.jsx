import React from 'react';
import Header from '../layout/Header';
import Contact from './Contact';
import Pricing from '../features/Pricing';
import { useTranslation } from 'react-i18next';
import SEO from '../ui/SEO';

const MembershipsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#0046b8] text-white">
            <SEO title={t('pricing.memberships')} description={t('pricing.subtitle')} />
            <Header theme="white" />

            {/* Hero Section */}
            <div className="pt-32 pb-10 px-4 md:px-12 lg:px-24 max-w-[90rem] mx-auto text-center">
                <span className="text-white/80 font-semibold tracking-widest uppercase text-sm mb-4 block">
                    {t('pricing.exclusive_plans')}
                </span>
                <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight">
                    {t('pricing.memberships')}
                </h1>
                <p className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto">
                    {t('pricing.subtitle')}
                </p>
            </div>

            {/* Pricing Section */}
            <div className="relative z-10">
                <Pricing />
            </div>

            {/* Contact Section */}
            <div className="relative z-10">
                <Contact />
            </div>
        </div>
    );
};

export default MembershipsPage;
