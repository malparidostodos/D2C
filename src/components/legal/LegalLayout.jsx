import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../layout/Header';
import Contact from '../pages/Contact';
import SEO from '../ui/SEO';

const LegalLayout = ({ children, title, subtitle, sections }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('');

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language === 'en' ? '/en' : '';
        return `${currentLang}${path}`;
    };

    const links = [
        { path: '/privacy-policy', label: 'legal.privacy_policy' },
        { path: '/terms-conditions', label: 'legal.terms_conditions' },
        { path: '/cookie-policy', label: 'legal.cookie_policy' },
        { path: '/disclaimers', label: 'legal.disclaimers.title' },
    ];

    // Track active section on scroll
    useEffect(() => {
        if (!sections || sections.length === 0) return;

        const handleScroll = () => {
            const fromTop = window.scrollY + 200;

            let current = '';
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const sectionTop = element.offsetTop;
                    if (sectionTop <= fromTop) {
                        current = section.id;
                    }
                }
            });

            if (current !== activeSection) {
                setActiveSection(current);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections, activeSection]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0046b8] font-sans flex flex-col">
            <SEO title={title} description={subtitle} />
            <Header theme="white" />

            {/* Hero Section */}
            <div className="pt-96 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[95%] mx-auto flex flex-col md:flex-row justify-between items-end gap-8 text-white">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tighter max-w-5xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-blue-100 text-xl md:text-2xl max-w-xl leading-relaxed text-left mb-2 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content Area - Card */}
            <div className="flex-grow px-2 sm:px-4 pb-12">
                <div className="max-w-[98%] mx-auto bg-white rounded-[2.5rem] shadow-2xl min-h-[600px]">
                    <div className={sections && sections.length > 0 ? "lg:grid lg:grid-cols-12" : "lg:grid lg:grid-cols-12"}>

                        {/* Sidebar Navigation - Policy Links */}
                        <aside className="lg:col-span-3 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 py-12 px-8 rounded-l-[2.5rem]">
                            <nav className="space-y-2 lg:sticky lg:top-8">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 px-4">
                                    {t('legal.menu_title')}
                                </h3>
                                {links.map((link) => {
                                    const fullPath = getLocalizedPath(link.path);
                                    const isActive = location.pathname === fullPath;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={fullPath}
                                            className={`group flex items-center px-4 py-3 text-base font-medium transition-all duration-200 border-l-2 ${isActive
                                                ? 'border-[#0046b8] text-[#0046b8]'
                                                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                                }`}
                                        >
                                            {t(link.label)}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* Main Content + Section Navigation */}
                        <div className={sections && sections.length > 0 ? "lg:col-span-9 lg:grid lg:grid-cols-12" : "lg:col-span-9"}>

                            {/* Content */}
                            <main className={sections && sections.length > 0 ? "lg:col-span-9 p-8 sm:p-12 lg:p-16" : "p-8 sm:p-12 lg:p-20"}>
                                <div className="max-w-none text-gray-600 
                                    [&_h1]:text-5xl [&_h1]:font-bold [&_h1]:text-[#1A1D1F] [&_h1]:mb-8 [&_h1]:tracking-tight
                                    [&_h2]:text-4xl [&_h2]:font-semibold [&_h2]:text-[#1A1D1F] [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:tracking-tight
                                    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-[#1A1D1F] [&_h3]:mt-10 [&_h3]:mb-4
                                    [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:mb-6
                                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2 [&_li]:text-lg
                                    [&_a]:text-[#0046b8] [&_a]:no-underline hover:[&_a]:underline
                                    [&_strong]:text-[#1A1D1F] [&_strong]:font-semibold">
                                    {children}
                                </div>
                            </main>

                            {/* Section Navigation - Right Sidebar */}
                            {sections && sections.length > 0 && (
                                <aside className="hidden lg:block lg:col-span-3 bg-gray-50 border-l border-gray-100 py-12 px-6 rounded-r-[2.5rem]">
                                    <nav className="sticky top-8">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            {t('legal.on_this_page')}
                                        </h4>
                                        <ul className="space-y-2">
                                            {sections.map((section) => (
                                                <li key={section.id}>
                                                    <button
                                                        onClick={() => scrollToSection(section.id)}
                                                        className={`text-left text-sm transition-colors duration-200 hover:text-[#0046b8] ${activeSection === section.id
                                                            ? 'text-[#0046b8] font-semibold'
                                                            : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {t(section.label)}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </aside>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Contact />
        </div>
    );
};

export default LegalLayout;
