import React from 'react';
import Header from '../layout/Header';
import FlavorSection from '../features/FlavorSection';
import { Phone, Check, ChevronRight, Car, Video, Armchair, Disc, Paintbrush, Wrench, Quote, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Contact from './Contact';

const ServicesPage = () => {
    const { t } = useTranslation();

    const servicesList = t('services_page.sidebar.services_list', { returnObjects: true });

    const serviceIcons = [
        Car,
        Video,
        Armchair,
        Disc,
        Paintbrush,
        Wrench
    ];

    const handleServiceClick = (index) => {
        // Map sidebar index to flavor index
        // Sidebar: 0:Detailing, 1:Video, 2:Interior, 3:Wheels, 4:Paint, 5:Engine
        // Flavors: 0:Exterior, 1:Interior, 2:Engine, 3:Paint, 4:Wheels, 5:Wash

        const map = {
            0: 0, // Detailing Completo -> Exterior
            1: 5, // Video Sync -> Wash (Fallback)
            2: 1, // Interior -> Interior
            3: 4, // Wheels -> Wheels
            4: 3, // Paint -> Paint
            5: 2  // Engine -> Engine
        };

        const flavorIndex = map[index];
        const element = document.getElementById(`flavor-${flavorIndex}`);

        if (element) {
            // Check if desktop (GSAP pinned section)
            if (window.innerWidth >= 1024) {
                const section = document.querySelector('.flavor-section');
                if (section) {
                    // Calculate relative position
                    // The horizontal scroll is mapped to vertical scroll
                    // We need to find where the card is horizontally relative to the container start
                    const container = document.querySelector('.flavors');
                    const cardOffset = element.offsetLeft;

                    // Scroll to the section start + horizontal offset
                    // We add a small buffer to center it or ensure it's in view
                    const sectionTop = section.offsetTop;
                    // Note: This is an approximation. GSAP pinning makes exact calculation tricky without accessing the timeline.
                    // But generally 1px vertical = 1px horizontal in this setup.
                    window.scrollTo({
                        top: sectionTop + cardOffset,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Mobile/Tablet - native horizontal scroll
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                // Also scroll window to the section if needed
                const section = document.getElementById('precios');
                if (section) {
                    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: sectionTop - 100, // Offset for header
                        behavior: 'smooth'
                    });
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0046b8] text-white">
            <Header theme="white" />

            {/* Top Section */}
            <div className="pt-32 pb-20 px-4 md:px-12 lg:px-24 max-w-[90rem] mx-auto">
                {/* Breadcrumb / Title */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">{t('services_page.title')}</h1>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content - Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Main Image */}
                        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative group shadow-2xl">
                            <img
                                src="/images/services-main.jpg"
                                alt="Car Detailing Service"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-12">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('services_page.description_title')}</h2>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                            {/* Description Text */}
                            <div className="space-y-8">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {t('services_page.description')}
                                </p>

                                {/* Quote Box */}
                                <div className="relative bg-blue-50 p-8 rounded-2xl border-l-4 border-[#0046b8] my-8">
                                    <Quote className="absolute top-4 right-4 w-8 h-8 text-[#0046b8]/20" />
                                    <p className="text-[#0046b8] italic text-lg font-medium relative z-10">
                                        {t('services_page.quote')}
                                    </p>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold mb-8 text-gray-900">{t('services_page.features.certified_team')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        t('services_page.features.certified_team'),
                                        t('services_page.features.premium_products'),
                                        t('services_page.features.satisfaction_guarantee')
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                                <Check className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="font-medium text-gray-700 group-hover:text-gray-900">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column (1/3) */}
                    <div className="space-y-8">
                        {/* All Services Widget */}
                        <div className="bg-white rounded-3xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-xl font-bold mb-6 text-[#0046b8]">{t('services_page.sidebar.all_services')}</h3>
                            <ul className="space-y-3">
                                {servicesList.map((service, index) => {
                                    const Icon = serviceIcons[index] || Car;
                                    return (
                                        <li key={index}>
                                            <button
                                                onClick={() => handleServiceClick(index)}
                                                className="w-full flex items-center justify-between group p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0046b8] group-hover:bg-[#0046b8] group-hover:text-white transition-colors">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-gray-600 group-hover:text-[#0046b8] transition-colors font-medium text-sm">{service}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0046b8] transition-colors" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Contact Widget */}
                        <div className="bg-[#00358a] rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-[#0046b8] shadow-lg">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <span className="text-white/80 font-bold uppercase tracking-wider text-sm mb-2">{t('services_page.sidebar.call_us')}</span>
                                <a href="tel:+573009443004" className="text-2xl font-bold text-white hover:text-white/90 transition-colors mb-6 block">+57 300 944 30 04</a>

                                <Link to="/reserva" className="w-full bg-white text-[#0046b8] py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mb-3">
                                    {t('services_page.sidebar.book_now')}
                                </Link>
                                <a href="https://wa.me/573009443004" target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    {t('services_page.sidebar.whatsapp')}
                                </a>
                            </div>
                        </div>

                        {/* Image Widget */}
                        <div className="rounded-3xl overflow-hidden h-64 relative shadow-xl group">
                            <img
                                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop"
                                alt="Detailing Process"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                <p className="font-bold text-lg text-white">Professional Care</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Existing Flavor Section */}
            <div className="relative z-10">
                <FlavorSection />
            </div>

            {/* Contact Section */}
            <div className="relative z-10">
                <Contact />
            </div>
        </div>
    );
};

export default ServicesPage;
