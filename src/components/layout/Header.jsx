import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Home, ChevronDown, ArrowUpRight, User, ArrowRight, X, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../JetonHeader.css'; // Import the strict CSS
import { useMenu } from '../../hooks/useMenu.jsx';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../ui/Logo';
import LogoSemiBold from '../ui/LogoSemiBold';

const Header = ({ theme = 'default', showThemeToggle = false, alwaysVisible = false }) => {
    const {
        hidden, setHidden, menuOpen, setMenuOpen, menuClosing, menuEntering,
        servicesOpen, setServicesOpen, supportOpen, setSupportOpen, activeSection, setHoverLock,
        hoveredService, setHoveredService, langOpen, setLangOpen, langRef,
        handleNavClick, handleLanguageChange, handleMenuClose, getLocalizedPath,
        setIsMenuMounted, navigateWithTransition, isHero, isFooterVisible
    } = useMenu();

    useEffect(() => {
        setIsMenuMounted(true);
        return () => setIsMenuMounted(false);
    }, [setIsMenuMounted]);

    const [user, setUser] = useState(null);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].some(path => location.pathname.includes(path));
    const isBookingPage = location.pathname.includes('/booking') || location.pathname.includes('/reserva');
    const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'ES';

    const isHomePage = location.pathname === '/' || location.pathname === '/en' || location.pathname === '/en/';

    // State to delay the theme switch when leaving the home page
    const [isHomeDelayed, setIsHomeDelayed] = useState(isHomePage);

    useEffect(() => {
        if (isHomePage) {
            setIsHomeDelayed(true);
        } else {
            // Delay changing to dark theme to match the transition/curtain animation (600ms)
            const timer = setTimeout(() => {
                setIsHomeDelayed(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isHomePage]);

    const showAuthButton = !isHomeDelayed || activeSection !== '#inicio';

    // Force white theme on Home section (Inicio) - NOW ALWAYS ON HOME due to blue background
    const effectiveTheme = isHomeDelayed ? 'white' : theme;

    const languages = [
        { code: 'ES', label: 'Español' },
        { code: 'EN', label: 'English' },
    ];

    const servicesDropdown = [
        { name: t('header.services'), path: currentLang === 'EN' ? '/services' : '/servicios', id: 'services', image: `/images/services-preview-${currentLang.toLowerCase()}.png` },
        { name: t('header.process'), path: currentLang === 'EN' ? '/roadmap' : '/proceso', id: 'roadmap' },
        { name: t('header.memberships'), path: currentLang === 'EN' ? '/memberships' : '/membresias', id: '#membresias' },
    ];

    const supportDropdown = [
        { name: t('header.faq'), path: '/faq', id: 'faq' },
        { name: t('header.legal'), path: currentLang === 'EN' ? '/privacy-policy' : '/politica-de-privacidad', id: 'legal' },
    ];

    // Helper to handle transition navigation
    const onTransitionLinkClick = (e, path) => {
        e.preventDefault();
        // Close menu if open
        setMenuOpen(false);
        setServicesOpen(false);

        const targetPath = getLocalizedPath(path);
        // If it's a hash link, use regular handleNavClick logic (scrolling)
        if (path.startsWith('#') || path.includes('#')) {
            handleNavClick(e, path.split('#')[1] ? '#' + path.split('#')[1] : null, path);
            return;
        }

        navigateWithTransition(targetPath);
    };

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

    // State for interactive preview
    const [activeCategory, setActiveCategory] = useState(null);

    // derived from reference script.js
    const menuVariants = {
        hidden: {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            pointerEvents: "none"
        },
        visible: {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            pointerEvents: "all",
            transition: {
                duration: 1,
                ease: [0.33, 1, 0.68, 1] // Power2.out equivalent
            }
        },
        exit: {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            pointerEvents: "none",
            transition: {
                duration: 1, // Match open duration for reverse feel
                ease: [0.33, 1, 0.68, 1] // Power2.out (reversed visually by clip motion) or [0.32, 0, 0.67, 0] Power2.in. Using cubic-bezier for easeIn to match reverse.
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.05 + (i * 0.05), // faster stagger
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1] // Power1.inOut / easeOutExpo
            }
        }),
        exit: {
            opacity: 0,
            y: 60, // Return to initial position
            transition: {
                duration: 0.5,
                ease: "easeIn"
            }
        }
    };

    // Theme Management
    const { isDarkMode, toggleTheme } = useTheme();

    // Determine visibility class
    // Mobile: Respect 'hidden' (from useMenu scroll logic)
    // Desktop: If alwaysVisible is true, force translate-y-0 using CSS media query override
    // Also force visibility if we are in the Hero section
    // FORCE HIDE if isFooterVisible is true (overrides everything)
    const shouldHide = isFooterVisible || (hidden && !isHero);
    const visibilityClass = shouldHide ? '-translate-y-full' : 'translate-y-0';
    const desktopOverrideClass = (alwaysVisible && !isFooterVisible) ? 'md:translate-y-0' : '';

    // Simplified Theme Logic:
    // Auth Pages -> Always White
    // Booking Page -> White only in Dark Mode
    // Default (Home/Others) -> Yellow/Blue (Mix Blend)
    const useSolidWhite = isAuthPage || (isBookingPage && isDarkMode);

    return (
        <>
            {/* Navbar (Logo + Menu Btn) - Fixed exactly like reference */}
            <nav className={`fixed top-0 left-0 w-full p-8 md:px-12 z-[9990] flex justify-between items-center ${useSolidWhite ? 'text-white mix-blend-normal' : 'text-[#FFFF00] mix-blend-difference'} transition-transform duration-500 select-none ${visibilityClass} ${desktopOverrideClass}`}>
                {/* Logo - Always non-clickable in Navbar as requested */}
                {/* Logo */}
                {isHero ? (
                    <div className="text-xl font-medium tracking-tight cursor-default">
                        <LogoSemiBold className="h-6 w-auto" />
                    </div>
                ) : (
                    <a
                        href={getLocalizedPath('/')}
                        onClick={(e) => handleNavClick(e, '#inicio', '/')}
                        className="text-xl font-medium tracking-tight cursor-pointer"
                    >
                        <LogoSemiBold className="h-6 w-auto" />
                    </a>
                )}

                {/* Right Side: Language + Menu */}
                <div className="flex items-center gap-2 md:gap-8" ref={langRef}>
                    {/* Theme Toggle */}
                    {showThemeToggle && (
                        <button
                            onClick={toggleTheme}
                            className="cursor-pointer text-base font-medium flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#FFFF00]/10 transition-colors"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}

                    {/* Language Selector (Main) */}
                    <div className="relative">
                        <div
                            className="cursor-pointer text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-1 md:gap-2 border border-current rounded-xl md:rounded-2xl px-3 md:px-5 h-8 md:h-10 hover:opacity-70 transition-opacity"
                            onClick={() => setLangOpen(!langOpen)}
                        >
                            <Globe size={14} className="md:w-4 md:h-4 w-3.5 h-3.5" strokeWidth={2} />
                            {currentLang}
                            <ChevronDown size={14} className={`transition-transform duration-300 md:w-3.5 md:h-3.5 w-3 h-3 ${langOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-4 bg-[#FFFF00]/30 border border-[#FFFF00]/40 backdrop-blur-xl rounded-2xl p-2 min-w-[150px] shadow-2xl overflow-hidden origin-top-right mix-blend-normal text-[#FFFF00]"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code.toLowerCase())}
                                            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all rounded-xl flex items-center justify-between group ${currentLang === lang.code
                                                ? 'bg-[#FFFF00]/40 text-[#FFFF00] shadow-sm ring-1 ring-[#FFFF00]/50'
                                                : 'text-[#FFFF00] hover:bg-[#FFFF00]/20 hover:text-[#FFFF00]'
                                                }`}
                                        >
                                            {lang.label}
                                            {currentLang === lang.code && <div className="w-1.5 h-1.5 bg-[#FFFF00] rounded-full shadow-[0_0_8px_rgba(255,255,0,0.8)]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Menu Trigger */}
                    <div
                        className="cursor-pointer text-xs md:text-sm font-medium tracking-wider flex items-center justify-center px-4 md:px-0 w-20 md:w-24 h-8 md:h-10 border border-current rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors"
                        onClick={() => { setMenuOpen(true); setLangOpen(false); }}
                    >
                        {t('header.menu')}
                    </div>
                </div>
            </nav>

            {/* FULL SCREEN OVERLAY - Matches reference structure */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 left-0 w-full h-[85vh] bg-[#0046b8] text-white z-[10000] p-8 md:px-12 flex flex-col justify-between select-none"
                    >
                        {/* Menu Nav (Header inside overlay) */}
                        <div className="flex justify-between items-center mb-4 md:mb-6 relative z-20 shrink-0">
                            {isHero ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-xl font-medium tracking-tight cursor-default"
                                >
                                    <LogoSemiBold className="h-6 w-auto" />
                                </motion.div>
                            ) : (
                                <motion.a
                                    href={getLocalizedPath('/')}
                                    onClick={(e) => handleNavClick(e, '#inicio', '/')}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-xl font-medium tracking-tight cursor-pointer"
                                >
                                    <LogoSemiBold className="h-6 w-auto" />
                                </motion.a>
                            )}
                            <div className="flex items-center gap-2 md:gap-8">
                                {/* Language Selector (Overlay) */}
                                <div className="relative">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="cursor-pointer text-xs md:text-sm font-medium uppercase tracking-wider flex items-center gap-1 md:gap-2 border border-current rounded-xl md:rounded-2xl px-3 md:px-5 h-8 md:h-10 hover:opacity-70 transition-opacity"
                                        onClick={() => setLangOpen(!langOpen)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <Globe size={14} className="md:w-4 md:h-4 w-3.5 h-3.5" strokeWidth={2} />
                                        {currentLang}
                                        <ChevronDown size={14} className={`transition-transform duration-300 md:w-3.5 md:h-3.5 w-3 h-3 ${langOpen ? 'rotate-180' : ''}`} />
                                    </motion.div>

                                    <AnimatePresence>
                                        {langOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute top-full right-0 mt-4 bg-white/30 border border-white/40 backdrop-blur-xl rounded-2xl p-2 min-w-[150px] shadow-2xl z-50 origin-top-right"
                                            >
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={(e) => { e.stopPropagation(); handleLanguageChange(lang.code.toLowerCase()); setLangOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all rounded-xl flex items-center justify-between group ${currentLang === lang.code
                                                            ? 'bg-white/40 text-white shadow-sm ring-1 ring-white/50'
                                                            : 'text-white hover:bg-white/20 hover:text-white'
                                                            }`}
                                                    >
                                                        {lang.label}
                                                        {currentLang === lang.code && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="cursor-pointer text-xs md:text-sm font-medium tracking-wider flex items-center justify-center px-4 md:px-0 w-20 md:w-24 h-8 md:h-10 border border-current rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors"
                                    onClick={handleMenuClose}
                                >
                                    {t('header.close')}
                                </motion.button>
                            </div>
                        </div>

                        {/* Menu Columns */}
                        <div className="flex flex-1 flex-col md:flex-row gap-6 md:gap-8 overflow-y-auto md:overflow-hidden pb-4">

                            {/* Col 1: Video/Image */}
                            <div className="hidden md:flex flex-1 p-4 md:p-0 flex-col justify-center">
                                <div className="video w-full max-w-[600px] mx-auto md:mx-0">
                                    {/* Preview Image */}
                                    <motion.div
                                        className="video-preview w-full bg-cover bg-center rounded-sm relative overflow-hidden bg-black/20"
                                        style={{ backgroundImage: `url(${servicesDropdown.find(s => s.id === activeCategory)?.image || "/images/hero-bg.jpg"})` }}
                                        initial={{ height: 0 }}
                                        animate={{ height: "300px" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />

                                    {/* Details */}
                                    <div className="video-details flex justify-between py-2 text-sm opacity-70 font-mono">
                                        <p className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse" />
                                            {t('header.preview')}
                                        </p>
                                        <p>{activeCategory ? activeCategory.toUpperCase() : t('header.menu').toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Col 2: Links */}
                            <div className="flex-1 flex flex-col justify-center items-start pl-0 md:pl-12 lg:pl-20 overflow-visible">
                                {/* Menu Links Container: w-fit allows it to scale to the widest item */}
                                <div className="flex flex-col w-full md:w-fit md:min-w-[300px]">
                                    {[
                                        [{ name: t('header.home'), path: '/inicio', id: '#inicio' }],
                                        servicesDropdown,
                                        [{ name: t('header.legal'), path: '/privacy-policy', id: 'legal' }],
                                        [{ name: t('header.faq'), path: '/faq', id: 'faq' }]
                                    ].map((group, groupIndex) => (
                                        <div key={groupIndex} className="flex flex-col gap-1 mb-3 md:mb-6 last:mb-0">
                                            {group.map((item, index) => {
                                                const legalPaths = [
                                                    '/privacy-policy', '/politica-de-privacidad',
                                                    '/terms-conditions', '/terminos-y-condiciones',
                                                    '/cookie-policy', '/politica-de-cookies',
                                                    '/disclaimers', '/descargos'
                                                ];
                                                let isActive = (item.id === activeSection) || ((location.pathname === getLocalizedPath(item.path)) && !item.path.includes('#'));

                                                if (item.id === 'legal') {
                                                    // Check against all localized legal paths
                                                    const currentPath = location.pathname.replace(/^\/en/, '') || '/';
                                                    isActive = legalPaths.some(path => location.pathname === getLocalizedPath(path) || path === currentPath);
                                                }

                                                return (
                                                    <motion.div
                                                        key={item.name}
                                                        custom={groupIndex * 3 + index} // Adjusted stagger delay
                                                        variants={itemVariants}
                                                        className={`menu-link relative w-full flex items-center justify-between gap-12 group ${isActive ? 'pointer-events-none' : 'cursor-pointer'}`}
                                                        onMouseEnter={() => setActiveCategory(item.id)}
                                                        onMouseLeave={() => setActiveCategory(null)}
                                                    >
                                                        <a
                                                            href={getLocalizedPath(item.path)}
                                                            onClick={(e) => { handleMenuClose(); onTransitionLinkClick(e, item.path); }}
                                                            className="text-2xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight block w-fit text-white transition-colors py-1"
                                                        >
                                                            {item.name}
                                                        </a>
                                                        {isActive && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-white rounded-full"
                                                            />
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ))}

                                    {/* Auth Container */}
                                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                                        {!user && (
                                            <motion.div
                                                custom={8}
                                                variants={itemVariants}
                                                className="w-full sm:w-max"
                                            >
                                                <Link
                                                    to={getLocalizedPath('/login')}
                                                    onClick={(e) => { handleMenuClose(); onTransitionLinkClick(e, '/login'); }}
                                                    className="btn relative border border-white/30 px-6 py-2.5 rounded-full overflow-hidden cursor-pointer group hover:border-white transition-colors flex items-center justify-center"
                                                >
                                                    <span className="relative z-10 text-xs font-semibold uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                                                        {t('header.login')}
                                                    </span>
                                                    {/* Fill Effect */}
                                                    <div className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-300 group-hover:w-full z-0" />
                                                </Link>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            custom={9}
                                            variants={itemVariants}
                                            className="w-full sm:w-max"
                                        >
                                            <a
                                                href={(user ? getLocalizedPath("/dashboard") : getLocalizedPath("/signup"))}
                                                onClick={(e) => { handleMenuClose(); onTransitionLinkClick(e, user ? "/dashboard" : "/signup"); }}
                                                className="btn relative border border-white/30 px-6 py-2.5 rounded-full overflow-hidden cursor-pointer group hover:border-white transition-colors flex items-center justify-center"
                                            >
                                                <span className="relative z-10 text-xs font-semibold uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                                                    {user ? t('dashboard.title') : t('header.signup')}
                                                </span>
                                                {/* Fill Effect */}
                                                <div className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-300 group-hover:w-full z-0" />
                                            </a>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Footer */}
                        <div className="menu-footer flex flex-col mt-4 shrink-0">
                            <motion.div
                                className="menu-divider w-full h-[1px] bg-white/30 my-4"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                            />

                            <div className="menu-footer-copy flex justify-between items-end text-sm uppercase tracking-wide opacity-60">
                                <div className="slogan">
                                    <p>{t('header.slogan')}</p>
                                </div>
                                <div className="socials flex gap-6">
                                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                                </div>
                            </div>
                        </div>

                    </motion.div >
                )}
            </AnimatePresence >
        </>
    );
};

export default Header;