import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Home, ChevronDown, ArrowUpRight, User, ArrowRight } from 'lucide-react';
import '../JetonHeader.css'; // Import the strict CSS
import { useMenu } from '../../hooks/useMenu';

const Header = ({ theme = 'default' }) => {
    const {
        hidden, setHidden, menuOpen, setMenuOpen, menuClosing, menuEntering,
        servicesOpen, setServicesOpen, activeSection, setHoverLock,
        hoveredService, setHoveredService, langOpen, setLangOpen, langRef,
        handleNavClick, handleLanguageChange, handleMenuClose, getLocalizedPath
    } = useMenu();

    const [user, setUser] = useState(null);
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'ES';

    const languages = [
        { code: 'ES', label: 'Español' },
        { code: 'EN', label: 'English' },
    ];

    const servicesDropdown = [
        { name: t('header.pricing'), path: '/precios', id: '#precios' },
        { name: t('header.process'), path: '/roadmap', id: '#roadmap' },
        { name: t('header.memberships'), path: '/membresias', id: '#membresias' },
    ];

    const isServiceActive = servicesDropdown.some(item => item.id === activeSection);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            {/* Shadow hint */}
            <div
                className={`fixed -bottom-24 left-1/2 -translate-x-1/2 w-[60vw] h-24 bg-white/20 blur-[80px] rounded-t-full pointer-events-none transition-opacity duration-700 ${hidden ? 'opacity-100' : 'opacity-0'}`}
                style={{ zIndex: 40 }}
            />

            {/* Top Navbar (Jeton Style) */}
            <div className="_navbar">
                <div className="nav-container">
                    {/* Logo */}
                    <Link to={getLocalizedPath('/')} className={`text-3xl font-display font-bold tracking-tighter ${theme === 'white' ? 'text-white' : 'text-black'}`}>
                        Ta' <span className="text-accent">To'</span> Clean
                    </Link>

                    <div className="lang-cta-wrapper">
                        {/* Language Selector (Updated Structure) */}
                        {/* Language Selector (Interactive) */}
                        <div ref={langRef} className="_dropdown _language-select md:flex" aria-expanded={langOpen} role="button">
                            <button
                                className="_dropdown-button w-full flex items-center justify-center gap-2 !bg-white/10 !backdrop-blur-md !border !border-white/50 !text-white hover:!bg-white/30 transition-all duration-300 rounded-full px-4 py-2"
                                onClick={() => setLangOpen(!langOpen)}
                                data-button=""
                                data-tone="orange"
                                data-variant="outline"
                                data-expanded={langOpen}
                            >
                                <div data-button-background=""></div>
                                <span className="_icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                        <path d="M12 22C17.5228 22 22 17.5229 22 12C22 6.47716 17.5228 2 12 2C6.47715 2 2 6.47716 2 12C2 17.5229 6.47715 22 12 22Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3 9H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3 15H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M12 2C14.5013 4.73836 15.9228 8.29204 16 12C15.9228 15.708 14.5013 19.2617 12 22C9.49872 19.2617 8.07725 15.708 8 12C8.07725 8.29204 9.49872 4.73836 12 2V2Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                <span>{currentLang}</span>
                                <span className={`_icon chevron ${langOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 13.9393L6.53033 8.46967L5.46967 9.53033L10.409 14.4697C11.2877 15.3483 12.7123 15.3484 13.591 14.4697L18.5303 9.53033L17.4697 8.46967L12 13.9393Z" data-mode="fill" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </button>

                            {langOpen && (
                                <div className="_language-dropdown-menu">
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className={`_lang-item ${currentLang === lang.code ? 'active' : ''}`}
                                            onClick={() => handleLanguageChange(lang.code)}
                                        >
                                            <span>{lang.label}</span>
                                            {currentLang === lang.code && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="ctas hidden md:flex">
                            {user ? (
                                <Link
                                    to={getLocalizedPath("/dashboard")}
                                    className={`_button transition-all duration-300 flex items-center gap-2 ${theme === 'white' ? '!bg-white !text-[#0046b8]' : '!bg-[#0046b8] !text-white'}`}
                                    data-variant="ghost"
                                >
                                    <User size={18} />
                                    <span className="staggered-wrapper">
                                        {t('dashboard.title').split("").map((char, i) => (
                                            <span key={i} className="staggered-char" data-char={char} style={{ "--index": i }}>
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        ))}
                                    </span>
                                </Link>
                            ) : (
                                <>
                                    <Link to={getLocalizedPath("/login")} className={`_button ${theme === 'white' ? '!bg-transparent !text-white border border-white/40 hover:!bg-white/10' : ''}`} data-variant="ghost">
                                        <span className="staggered-wrapper">
                                            {t('header.login').split("").map((char, i) => (
                                                <span key={i} className="staggered-char" data-char={char} style={{ "--index": i }}>
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </span>
                                    </Link>
                                    <Link
                                        to={getLocalizedPath("/signup")}
                                        className="_button !bg-white !text-[#0046b8] transition-all duration-300"
                                        data-variant="ghost"
                                    >
                                        <span className="staggered-wrapper">
                                            {t('header.signup').split("").map((char, i) => (
                                                <span key={i} className="staggered-char" data-char={char} style={{ "--index": i }}>
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu Structure (Bottom Pill) */}
            <div
                className={`_menu !z-[10000]`}
                style={{ transform: hidden ? 'translateY(250%)' : 'translateY(0)', transition: 'transform 0.35s ease-in-out' }}
            >
                <div
                    className="menu-bar"
                    style={{
                        backgroundColor: menuOpen ? '#2563eb' : '',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={() => { setHoverLock(true); setHidden(false); }}
                    onMouseLeave={() => { setHoverLock(false); setHoveredService(null); setServicesOpen(false); }}
                >
                    {/* INICIO */}
                    <button
                        className={`hidden md:flex _menu-button ${activeSection === '#inicio' ? '-active -exact' : ''}`}
                        onClick={(e) => handleNavClick(e, '#inicio', '/inicio')}
                        onMouseEnter={() => setServicesOpen(false)}
                    >
                        <div className="background"></div>
                        <Home size={20} strokeWidth={2} />
                    </button>

                    {/* SERVICIOS Dropdown Trigger (Desktop Only) */}
                    <button
                        className={`hidden md:flex _menu-button ${isServiceActive ? '-active -exact' : ''}`}
                        aria-expanded={servicesOpen}
                        data-services-open={servicesOpen ? 'true' : 'false'}
                        onMouseEnter={() => { setServicesOpen(true); }}
                    >
                        <div className="background"></div>
                        <span>{t('header.personal')}</span>
                        <ChevronDown
                            className="chevron-icon"
                            size={14}
                            strokeWidth={2.5}
                            style={{
                                marginLeft: 4,
                                transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                display: 'inline-block'
                            }}
                        />
                    </button>

                    {/* The Drawer (Dropup) */}
                    <div className="_menu-drawer">
                        <div className="slot">
                            <ul>
                                {servicesDropdown.map((item) => (
                                    <li
                                        key={item.name}
                                        onMouseEnter={() => setHoveredService(item.id)}
                                    >
                                        <a
                                            href={getLocalizedPath(item.path)}
                                            className="link"
                                            onClick={(e) => handleNavClick(e, item.id, item.path)}
                                        >
                                            <div className="label">{item.name}</div>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Preview Image */}
                            <div className={`menu-preview ${hoveredService ? 'active' : ''}`}>
                                {hoveredService === '#precios' && (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {t('header.pricing')}
                                    </div>
                                )}
                                {hoveredService === '#roadmap' && (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {t('header.process')}
                                    </div>
                                )}
                                {hoveredService === '#membresias' && (
                                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                                        {t('header.memberships')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* HABLEMOS CTA (Desktop Only) */}
                    <button
                        className={`hidden md:flex _menu-button group ${activeSection === '#contacto' ? '-active -exact' : ''}`}
                        onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
                        onMouseEnter={() => setServicesOpen(false)}
                    >
                        <div className="background"></div>
                        <span>{t('header.lets_talk')}</span>
                        <ArrowUpRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-110" />
                    </button>

                    {/* CONTACTO (Desktop Only) */}
                    <button
                        className={`hidden md:flex _menu-button group ${activeSection === '#contacto' ? '-active -exact' : ''}`}
                        onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
                        onMouseEnter={() => setServicesOpen(false)}
                    >
                        <div className="background"></div>
                        <span>{t('header.contact')}</span>
                        <ArrowUpRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-110" />
                    </button>

                    {/* Mobile Toggle (Single Pill) */}
                    <button
                        className="md:hidden _menu-button flex items-center gap-2 px-6"
                        onClick={() => menuOpen ? handleMenuClose() : setMenuOpen(true)}
                    >
                        <div className="background"></div>
                        <span className="font-medium text-base">Menu</span>
                        {/* Animated Two-Line Icon (=) */}
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <div className="absolute w-5 h-2 flex flex-col justify-between">
                                <span
                                    className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : 'rotate-0'
                                        }`}
                                />
                                <span
                                    className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : 'rotate-0'
                                        }`}
                                />
                            </div>
                        </div>
                    </button>

                </div>
            </div>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto">
                    {/* Blue Background Layer - slides up from bottom */}
                    <div
                        className="absolute inset-0 bg-[#0046b8]"
                        style={{
                            transform: menuClosing ? 'translateY(-100%)' : (menuEntering ? 'translateY(100%)' : 'translateY(0)'),
                            transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />

                    {/* Content Layer - slides with background */}
                    <div
                        className="absolute inset-0 z-10 flex flex-col h-full"
                        style={{
                            transform: menuClosing ? 'translateY(-100%)' : (menuEntering ? 'translateY(100%)' : 'translateY(0)'),
                            transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* Top Bar - appears first (at top) */}
                        <div
                            className="relative z-50 flex items-center justify-center px-6 pt-8 pb-6 gap-2"
                            style={{
                                opacity: menuEntering ? 0 : 1,
                                animation: menuClosing ? 'fadeOutDown 200ms ease-out 200ms forwards' : 'none',
                                transition: menuClosing ? 'none' : 'opacity 300ms ease-out 500ms'
                            }}
                        >
                            {/* Login Button */}
                            {!user && (
                                <Link
                                    to={getLocalizedPath("/login")}
                                    onClick={handleMenuClose}
                                    className="_button !bg-white/10 !backdrop-blur-md !border !border-white/50 !text-white hover:!bg-white/30 transition-all duration-300 !h-[48px] !px-6 !rounded-[16px] flex items-center justify-center font-medium text-base"
                                >
                                    {t('header.login')}
                                </Link>
                            )}

                            {/* Signup/Dashboard Button */}
                            {user ? (
                                <Link
                                    to={getLocalizedPath("/dashboard")}
                                    onClick={handleMenuClose}
                                    className="_button !bg-white !text-[#0046b8] transition-all duration-300 !h-[48px] !px-6 !rounded-[16px] flex items-center justify-center font-medium text-base"
                                >
                                    {t('dashboard.title')}
                                </Link>
                            ) : (
                                <Link
                                    to={getLocalizedPath("/signup")}
                                    onClick={handleMenuClose}
                                    className="_button !bg-white !text-[#0046b8] transition-all duration-300 !h-[48px] !px-6 !rounded-[16px] flex items-center justify-center font-medium text-base"
                                >
                                    {t('header.signup')}
                                </Link>
                            )}
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">

                            {/* Homepage Item */}
                            <a
                                href={getLocalizedPath("/inicio")}
                                onClick={(e) => { handleNavClick(e, '#inicio', '/inicio'); handleMenuClose(); }}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-colors group ${activeSection === '#inicio' ? 'bg-white/10' : 'hover:bg-white/5'
                                    }`}
                                style={{
                                    opacity: menuEntering ? 0 : 1,
                                    animation: menuClosing ? 'fadeOutDown 200ms ease-out 150ms forwards' : 'none',
                                    transition: menuClosing ? 'none' : 'opacity 300ms ease-out 540ms'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                                        <Home size={20} />
                                    </div>
                                    <span className="text-xl font-bold text-white">{t('header.home')}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full bg-white transition-opacity ${activeSection === '#inicio' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </a>

                            {/* Personal Section */}
                            <div style={{
                                opacity: menuEntering ? 0 : 1,
                                animation: menuClosing ? 'fadeOutDown 200ms ease-out 100ms forwards' : 'none',
                                transition: menuClosing ? 'none' : 'opacity 300ms ease-out 580ms'
                            }}>
                                <h3 className="text-white/60 text-sm font-medium mb-4 px-2">{t('header.personal')}</h3>
                                <div className="space-y-2">
                                    {/* Precios */}
                                    <a
                                        href={getLocalizedPath("/precios")}
                                        onClick={(e) => { handleNavClick(e, '#precios', '/precios'); handleMenuClose(); }}
                                        className={`flex items-center gap-4 p-2 rounded-xl transition-colors ${activeSection === '#precios' ? 'bg-white/10' : 'hover:bg-white/10'}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                                            <span className="font-bold text-lg">$</span>
                                        </div>
                                        <span className="text-lg font-bold text-white">{t('header.pricing')}</span>
                                    </a>

                                    {/* Proceso */}
                                    <a
                                        href={getLocalizedPath("/roadmap")}
                                        onClick={(e) => { handleNavClick(e, '#roadmap', '/roadmap'); handleMenuClose(); }}
                                        className={`flex items-center gap-4 p-2 rounded-xl transition-colors ${activeSection === '#roadmap' ? 'bg-white/10' : 'hover:bg-white/10'}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                                            <ArrowRight size={24} />
                                        </div>
                                        <span className="text-lg font-bold text-white">{t('header.process')}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Business Link (Membership) */}
                            <a
                                href={getLocalizedPath("/membresias")}
                                onClick={(e) => { handleNavClick(e, '#membresias', '/membresias'); handleMenuClose(); }}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${activeSection === '#membresias' ? 'bg-white/15' : 'hover:bg-white/10'
                                    }`}
                                style={{
                                    opacity: menuEntering ? 0 : 1,
                                    animation: menuClosing ? 'fadeOutDown 200ms ease-out 50ms forwards' : 'none',
                                    transition: menuClosing ? 'none' : 'opacity 300ms ease-out 620ms'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white font-bold">
                                        M
                                    </div>
                                    <span className="text-lg font-bold text-white">{t('header.memberships')}</span>
                                </div>
                                <ArrowUpRight size={20} className="text-white" />
                            </a>

                            {/* Company Section */}
                            <div style={{
                                opacity: menuEntering ? 0 : 1,
                                animation: menuClosing ? 'fadeOutDown 200ms ease-out forwards' : 'none',
                                transition: menuClosing ? 'none' : 'opacity 300ms ease-out 660ms'
                            }}>
                                <h3 className="text-white/60 text-sm font-medium mb-4 px-2">{t('header.contact')}</h3>
                                <div className="space-y-2">
                                    <a
                                        href={getLocalizedPath("/contacto")}
                                        onClick={(e) => { handleNavClick(e, '#contacto', '/contacto'); handleMenuClose(); }}
                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                                            <User size={24} />
                                        </div>
                                        <span className="text-lg font-bold text-white">{t('header.lets_talk')}</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
