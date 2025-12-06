import React from 'react';
import Header from '../layout/Header';
import Contact from './Contact';
import Gallery from './Gallery';
import ProcessTimeline from '../features/ProcessTimeline';
import { useTranslation } from 'react-i18next';
import { Settings, Quote, Check, Timer } from 'lucide-react';
import SEO from '../ui/SEO';

const ProcessPage = () => {
    const { t } = useTranslation();

    const processSteps = t('process_page.steps', { returnObjects: true });

    return (
        <div className="min-h-screen bg-[#0046b8] text-white">
            <SEO title={t('process_page.title')} description={t('process_page.description')} />
            <Header theme="white" />

            {/* Hero Section - 2 Columns */}
            <div className="pt-32 pb-20 px-4 md:px-12 lg:px-24 max-w-[90rem] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Left Column (60%) */}
                    <div className="lg:col-span-3 text-center lg:text-left">
                        <span className="text-white/80 font-semibold tracking-widest uppercase text-sm mb-4 block">
                            {t('process_page.hero.subtitle', 'Nuestra Metodología Certificada')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight">
                            {t('process_page.title')}
                        </h1>
                        <p className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {t('process_page.description')}
                        </p>
                    </div>

                    {/* Right Column (40%) */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <Timer className="w-10 h-10 text-[#0046b8]" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white text-center mb-2">
                            {t('process_page.hero.cta_title', 'Resultados Reales')}
                        </h3>
                        <p className="text-white/80 text-center">
                            {t('process_page.hero.cta_desc', 'En 5 Etapas de Excelencia')}
                        </p>
                    </div>
                </div>
            </div>

            {/* White Content Container */}
            <div className="px-4 md:px-12 lg:px-24 max-w-[90rem] mx-auto mb-24 relative z-10">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-gray-800">
                    {/* Intro & Quote */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        <p className="text-lg md:text-xl leading-relaxed text-center text-gray-600">
                            {t('process_page.intro', 'Entendemos que la confianza se gana con transparencia. Por eso, compartimos nuestro sistema detallado para que sepas exactamente cómo cuidamos tu vehículo.')}
                        </p>

                        {/* Quote Box */}
                        <div className="relative bg-blue-50 p-8 rounded-2xl border-l-4 border-[#0046b8]">
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-[#0046b8]/20" />
                            <p className="text-[#0046b8] italic text-lg font-medium relative z-10 text-center">
                                "{t('process_page.quote', 'Nuestro compromiso es con la precisión y la calidad para asegurar que cada superficie se vea y se sienta perfecta.')}"
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                            {[
                                t('process_page.benefits.1', 'Diagnóstico por Expertos'),
                                t('process_page.benefits.2', 'Productos de Nanotecnología'),
                                t('process_page.benefits.3', 'Garantía de Protección')
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors shrink-0">
                                        <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section (Isolated) */}
            <div className="bg-gray-50 py-24">
                <Gallery />
            </div>

            {/* Timeline Section */}
            <div className="py-24 px-4 bg-[#0046b8] relative">
                <div className="text-center mb-20">
                    <span className="text-white/60 font-semibold tracking-widest uppercase text-sm mb-2 block">
                        {t('process_page.method.subtitle', 'NUESTRO MÉTODO')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-semibold text-white">
                        {t('process_page.method.title')}
                    </h2>
                </div>
                <ProcessTimeline steps={processSteps} />
            </div>

            {/* Footer */}
            <div className="relative z-10">
                <Contact />
            </div>
        </div>
    );
};

export default ProcessPage;
