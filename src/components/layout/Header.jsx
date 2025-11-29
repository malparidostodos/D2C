import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSmoothScroll } from '../ui/SmoothScroll';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Menu, X, ArrowRight, Home, ChevronDown, ArrowUpRight, User, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import '../JetonHeader.css'; // Import the strict CSS

const Header = () => {
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuClosing, setMenuClosing] = useState(false);
    const [menuEntering, setMenuEntering] = useState(true);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('#inicio');
    const [hoverLock, setHoverLock] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const [langOpen, setLangOpen] = useState(false);
    const [user, setUser] = useState(null);

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'ES';

    const languages = [
        { code: 'ES', label: 'Español' },
        { code: 'EN', label: 'English' },
    ];
    const lastScrollY = useRef(0);
    const scrollingUp = useRef(false);
    const scrollTimeout = useRef(null);
    const langRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { lenis } = useSmoothScroll();

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

    // -------------------------------------------------
    // Mouse‑move & scroll visibility handling
    // -------------------------------------------------
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Always show on mobile
            if (window.innerWidth < 768) {
                setHidden(false);
                return;
            }

            const currentScrollY = lenis ? lenis.scroll : window.scrollY;
            const isAtTop = currentScrollY < 50;
            if (isAtTop) {
                setHidden(false);
                return;
            }

            if (scrollingUp.current) {
                return;
            }

            const bottomThreshold = 150;
            const isNearBottom = window.innerHeight - e.clientY < bottomThreshold;

            const screenWidth = window.innerWidth;
            const centerStart = screenWidth * 0.3;
            const centerEnd = screenWidth * 0.7;
            const isInCenter = e.clientX > centerStart && e.clientX < centerEnd;

            if ((isNearBottom && isInCenter) || hoverLock || menuOpen) {
                setHidden(false);
            } else if (!hoverLock && !menuOpen) {
                setHidden(true);
            }
        };

        const handleScrollVisibility = (e) => {
            // Always show on mobile
            if (window.innerWidth < 768) {
                setHidden(false);
                return;
            }

            // Support both lenis event object and native window fallback
            const currentScrollY = e && typeof e.scroll === 'number' ? e.scroll : window.scrollY;
            const isAtTop = currentScrollY < 50;

            if (isAtTop) {
                setHidden(false);
                scrollingUp.current = false;
                lastScrollY.current = currentScrollY;
                return;
            }

            const isScrollingUp = currentScrollY < lastScrollY.current;
            scrollingUp.current = isScrollingUp;

            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            if (isScrollingUp) {
                setHidden(false);
                scrollTimeout.current = setTimeout(() => {
                    scrollingUp.current = false;
                }, 300);
            } else if (!hoverLock && !menuOpen) {
                setHidden(true);

                scrollingUp.current = false;
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        if (lenis) {
            lenis.on('scroll', handleScrollVisibility);
        } else {
            window.addEventListener('scroll', handleScrollVisibility, { passive: true });
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (lenis) {
                lenis.off('scroll', handleScrollVisibility);
            } else {
                window.removeEventListener('scroll', handleScrollVisibility);
            }
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [hoverLock, menuOpen, lenis]);

    // -------------------------------------------------
    // Scroll‑spy
    // -------------------------------------------------
    useEffect(() => {
        const handleScroll = (e) => {
            const sections = [
                '#inicio',
                '#beneficios',
                '#colaboracion',
                '#precios',
                '#roadmap',
                '#membresias',
                '#contacto',
            ];

            const currentScrollY = e && typeof e.scroll === 'number' ? e.scroll : window.scrollY;
            const scrollPosition = currentScrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.querySelector(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (scrollPosition >= sectionTop) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }
        };

        if (lenis) {
            lenis.on('scroll', handleScroll);
            // Initial check
            handleScroll({ scroll: lenis.scroll });
        } else {
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (lenis) {
                lenis.off('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, [lenis]);

    // -------------------------------------------------
    // Click outside handler for language dropdown
    // -------------------------------------------------
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangOpen(false);
            }
        };

        if (langOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [langOpen]);

    // Helper to get localized path
    const getLocalizedPath = (path) => {
        const prefix = i18n.language === 'en' ? '/en' : '';
        // Avoid double slashes or double prefixes if path already has it (though path passed here is usually relative root)
        return `${prefix}${path}`;
    };

    const handleNavClick = (e, id, path) => {
        e.preventDefault();
        setMenuOpen(false);
        setServicesOpen(false);

        const localizedPath = getLocalizedPath(path);

        const scrollToElement = () => {
            if (id === '#contacto') {
                // Scroll to bottom of page for contacto section
                if (lenis) {
                    lenis.scrollTo(document.body.scrollHeight);
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            } else {
                const element = document.querySelector(id);
                if (element) {
                    if (lenis) {
                        lenis.scrollTo(element);
                    } else {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        // Check if we are on the same localized root path
        const currentPath = location.pathname;
        const isHome = currentPath === '/' || currentPath === '/en' || currentPath === '/en/';

        if (!isHome) {
            // Navigate to home (localized) then scroll
            const homePath = i18n.language === 'en' ? '/en' : '/';
            navigate(homePath);
            setTimeout(scrollToElement, 500);
        } else {
            scrollToElement();
        }
    };

    const handleLanguageChange = (langCode) => {
        const targetLang = langCode.toLowerCase();
        const currentPath = location.pathname;

        console.log('handleLanguageChange called with:', langCode);
        console.log('Current language:', i18n.language);
        console.log('Target language:', targetLang);
        console.log('Current path:', currentPath);

        // Don't change if already on the target language
        if (i18n.language === targetLang) {
            console.log('Already on target language, skipping');
            setLangOpen(false);
            return;
        }

        let newPath = currentPath;

        if (targetLang === 'en') {
            if (!currentPath.startsWith('/en')) {
                newPath = `/en${currentPath === '/' ? '' : currentPath}`;
            }
        } else {
            // Switch to ES (remove /en)
            if (currentPath.startsWith('/en')) {
                newPath = currentPath.replace(/^\/en/, '') || '/';
            }
        }

        console.log('New path will be:', newPath);

        // Explicitly change language in i18n
        i18n.changeLanguage(targetLang);

        // Force hard navigation to ensure language switch applies correctly
        if (newPath !== currentPath) {
            console.log('Navigating to:', newPath);
            window.location.href = newPath;
        } else {
            // If path is same but language changed (rare but possible), force reload
            console.log('Reloading page');
            window.location.reload();
        }

        setLangOpen(false);
    };

    const isServiceActive = ['#precios', '#roadmap', '#membresias'].includes(activeSection);

    const navLinks = [
        { name: t('header.home'), id: '#inicio', path: '/inicio' },
        { name: t('header.contact'), id: '#contacto', path: '/contacto' },
    ];

    const servicesDropdown = [
        { name: t('header.pricing'), path: '/precios', id: '#precios' },
        { name: t('header.process'), id: '#roadmap', path: '/roadmap' },
        { name: t('header.memberships'), id: '#membresias', path: '/membresias' },
    ];

    const scrollDown = () => {
        if (lenis) {
            lenis.scrollTo(window.scrollY + window.innerHeight);
        } else {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
    };

    const scrollUp = () => {
        if (lenis) {
            lenis.scrollTo(window.scrollY - window.innerHeight);
        } else {
            window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        }
    };

    // Handle menu close with animation
    const handleMenuClose = () => {
        setMenuClosing(true);
        setTimeout(() => {
            setMenuOpen(false);
            setMenuClosing(false);
        }, 450); // Wait for all items to fade out (200ms delay + 200ms animation + 50ms buffer)
    };

    // Handle menu entrance animation
    useEffect(() => {
        if (menuOpen) {
            // Reset to entering state
            setMenuEntering(true);
            // Trigger animation after mount
            const timer = setTimeout(() => {
                setMenuEntering(false);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            // Reset when menu closes so next open triggers animation
            setMenuEntering(true);
        }
    }, [menuOpen]);

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
                    <a href={getLocalizedPath('/')} className="text-3xl font-display font-bold text-black tracking-tighter">
                        Ta' <span className="text-accent">To'</span> Clean
                    </a>

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
                                    className="_button !bg-[#0046b8] !text-white transition-all duration-300 flex items-center gap-2"
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
                                    <a href={getLocalizedPath("/login")} className="_button" data-variant="ghost">
                                        <span className="staggered-wrapper">
                                            {t('header.login').split("").map((char, i) => (
                                                <span key={i} className="staggered-char" data-char={char} style={{ "--index": i }}>
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </span>
                                    </a>
                                    <a
                                        href={getLocalizedPath("/signup")}
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
                                    </a>
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
                                <a
                                    href={getLocalizedPath("/login")}
                                    onClick={handleMenuClose}
                                    className="_button !bg-white/10 !backdrop-blur-md !border !border-white/50 !text-white hover:!bg-white/30 transition-all duration-300 !h-[48px] !px-6 !rounded-[16px] flex items-center justify-center font-medium text-base"
                                >
                                    {t('header.login')}
                                </a>
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
                                <a
                                    href={getLocalizedPath("/signup")}
                                    onClick={handleMenuClose}
                                    className="_button !bg-white !text-[#0046b8] transition-all duration-300 !h-[48px] !px-6 !rounded-[16px] flex items-center justify-center font-medium text-base"
                                >
                                    {t('header.signup')}
                                </a>
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
