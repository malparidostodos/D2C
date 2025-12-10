import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSmoothScroll } from '../components/ui/SmoothScroll';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuClosing, setMenuClosing] = useState(false);
    const [menuEntering, setMenuEntering] = useState(true);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('#inicio');
    const [hoverLock, setHoverLock] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const [langOpen, setLangOpen] = useState(false);
    const [isMenuMounted, setIsMenuMounted] = useState(false);
    const [isHero, setIsHero] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    const { t, i18n } = useTranslation();
    const lastScrollY = useRef(0);
    const scrollingUp = useRef(false);
    const scrollTimeout = useRef(null);
    const stopScrollTimeout = useRef(null);
    const inactiveTimeout = useRef(null);
    const isHoveringTop = useRef(false);
    const langRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { lenis } = useSmoothScroll();

    // -------------------------------------------------
    // Mouse‑move & scroll visibility handling
    // -------------------------------------------------
    useEffect(() => {
        // Initial check for Hero state
        const isHome = location.pathname === '/' || location.pathname === '/es' || location.pathname === '/en';
        setIsHero(isHome && window.scrollY < window.innerHeight);

        const handleMouseMove = (e) => {
            // Check if Home Page AND within Hero section (prevent hiding)
            const isHome = location.pathname === '/' || location.pathname === '/es' || location.pathname === '/en';
            if (isHome && window.scrollY < window.innerHeight - 100) {
                setHidden(false);
                return;
            }



            // Check if inside top zone (200px)
            if (e.clientY < 200) {
                // Entered zone
                if (inactiveTimeout.current) {
                    clearTimeout(inactiveTimeout.current);
                }
                setHidden(false);
                isHoveringTop.current = true;
            } else {
                // Outside zone
                // If we just left the zone (isHoveringTop is true), start the timer
                if (isHoveringTop.current) {
                    isHoveringTop.current = false;

                    if (inactiveTimeout.current) {
                        clearTimeout(inactiveTimeout.current);
                    }

                    // Hide after 3 seconds of inactivity (leaving the zone)
                    inactiveTimeout.current = setTimeout(() => {
                        const isHomeNow = location.pathname === '/' || location.pathname === '/es' || location.pathname === '/en';
                        // Double check scroll position before hiding
                        if (isHomeNow && window.scrollY < window.innerHeight - 100) return;

                        if (!menuOpen && !hoverLock && !scrollingUp.current) {
                            setHidden(true);
                        }
                    }, 3000);
                }
            }

            // Keep visible if menu is open or hover is locked
            if (menuOpen || hoverLock) {
                if (inactiveTimeout.current) clearTimeout(inactiveTimeout.current);
                setHidden(false);
            }
        };

        const handleScrollVisibility = (e) => {
            // Close language dropdown when scrolling
            if (langOpen) {
                setLangOpen(false);
            }



            // Support both lenis event object and native window fallback
            const currentScrollY = e && typeof e.scroll === 'number' ? e.scroll : window.scrollY;

            // Allow navbar to stay visible in Home Hero section
            // Allow navbar to stay visible in Home Hero section
            const isHome = location.pathname === '/' || location.pathname === '/es' || location.pathname === '/en';
            setIsHero(isHome && currentScrollY < window.innerHeight);

            if (isHome && currentScrollY < window.innerHeight - 100) {
                setHidden(false);
                return;
            }

            const isAtTop = currentScrollY < 50;

            // Define "Show on Stop" timeout logic
            if (stopScrollTimeout.current) {
                clearTimeout(stopScrollTimeout.current);
            }

            // If user stops scrolling for 150ms, show navbar
            stopScrollTimeout.current = setTimeout(() => {
                if (!isFooterVisible) {
                    setHidden(false);
                }
            }, 150);

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
                // Hide while scrolling down
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
            if (stopScrollTimeout.current) {
                clearTimeout(stopScrollTimeout.current);
            }
            if (inactiveTimeout.current) {
                clearTimeout(inactiveTimeout.current);
            }
        };
    }, [hoverLock, menuOpen, langOpen, lenis]);

    // -------------------------------------------------
    // Scroll‑spy
    // -------------------------------------------------
    useEffect(() => {
        const handleScroll = (e) => {
            // Only scroll-spy on home page
            const currentPath = location.pathname;
            const isHome = currentPath === '/' || currentPath === '/en' || currentPath === '/en/';

            if (!isHome) {
                return;
            }

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
    }, [lenis, location.pathname]);

    // -------------------------------------------------
    // Route-based Active State
    // -------------------------------------------------
    useEffect(() => {
        const path = location.pathname;
        const isHome = path === '/' || path === '/en' || path === '/en/';

        if (!isHome) {
            if (path.includes('/faq') || path.includes('/privacy-policy') || path.includes('/terms-conditions') || path.includes('/cookie-policy') || path.includes('/disclaimers')) {
                setActiveSection('support');
            } else if (path.includes('/services')) {
                setActiveSection('services');
            } else if (path.includes('/roadmap')) {
                setActiveSection('roadmap');
            } else if (path.includes('/membresias')) {
                setActiveSection('#membresias'); // Matches Header logic
            } else if (path.includes('/contacto')) {
                setActiveSection('#contacto');   // Matches Header logic
            } else {
                setActiveSection('');
            }
        } else {
            // Re-initialize to #inicio if just arrived at home and at top
            // Scroll spy will take over if scrolled
            const currentScrollY = lenis ? lenis.scroll : window.scrollY;
            if (currentScrollY < 50) {
                setActiveSection('#inicio');
            }
        }
    }, [location.pathname, lenis]);

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
        return `${prefix}${path}`;
    };

    const handleNavClick = (e, id, path) => {
        e.preventDefault();
        setMenuOpen(false);
        setServicesOpen(false);
        setSupportOpen(false);

        const localizedPath = getLocalizedPath(path);

        // If it's not a hash link (section), just navigate
        if (!id.startsWith('#')) {
            navigateWithTransition(localizedPath);
            // window.scrollTo(0, 0); // Removed to allow PageTransition to handle scroll reset
            return;
        }

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
            navigateWithTransition(homePath);
            setTimeout(scrollToElement, 500);
        } else {
            scrollToElement();
        }
    };

    // -------------------------------------------------
    // View Transition Navigation
    // -------------------------------------------------
    const navigateWithTransition = (to) => {
        // Check for internal auth navigation (Login <-> Register <-> Forgot)
        const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
        const isAuthPath = (path) => authPaths.some(authPath => path.includes(authPath));

        if (isAuthPath(location.pathname) && isAuthPath(to)) {
            navigate(to);
            return;
        }

        // Fallback for browsers without View Transitions
        if (!document.startViewTransition) {
            navigate(to);
            return;
        }

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                navigate(to);
            });
        });

        transition.ready.then(() => {
            // "Curtain Effect" Animation using WAAPI
            // Old View: Slides up and fades out
            document.documentElement.animate(
                [
                    {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                    {
                        opacity: 1, // Keep opaque to prevent white background bleed
                        transform: "translateY(-35%)", // Slide up
                        filter: "brightness(0.4)", // Significantly darken
                    },
                ],
                {
                    duration: 800,
                    easing: "cubic-bezier(0.87, 0, 0.13, 1)",
                    fill: "forwards",
                    pseudoElement: "::view-transition-old(root)",
                }
            );

            // New View: Reveals from bottom (Curtain opens up)
            document.documentElement.animate(
                [
                    {
                        clipPath: "inset(100% 0 0 0)",
                    },
                    {
                        clipPath: "inset(0 0 0 0)",
                    },
                ],
                {
                    duration: 800,
                    easing: "cubic-bezier(0.87, 0, 0.13, 1)",
                    fill: "forwards",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    const handleLanguageChange = (langCode) => {
        const targetLang = langCode.toLowerCase();
        const currentPath = location.pathname;

        // Don't change if already on the target language
        if (i18n.language === targetLang) {
            console.log('Already on target language, skipping');
            setLangOpen(false);
            return;
        }

        // Route Mappings
        const esToEn = {
            '/servicios': '/services',
            '/proceso': '/roadmap',
            '/membresias': '/memberships',
            '/reserva': '/booking',
            '/politica-de-privacidad': '/privacy-policy',
            '/terminos-y-condiciones': '/terms-conditions',
            '/politica-de-cookies': '/cookie-policy',
            '/descargos': '/disclaimers'
        };

        const enToEs = {
            '/services': '/servicios',
            '/roadmap': '/proceso',
            '/memberships': '/membresias',
            '/booking': '/reserva',
            '/privacy-policy': '/politica-de-privacidad',
            '/terms-conditions': '/terminos-y-condiciones',
            '/cookie-policy': '/politica-de-cookies',
            '/disclaimers': '/descargos'
        };

        let newPath = currentPath;

        if (targetLang === 'en') {
            // Switching to English
            // If current path is Spanish (no /en prefix), check mapping
            if (!currentPath.startsWith('/en')) {
                // Remove trailing slash for matching if needed, though location.pathname usually strict
                const mappedPath = esToEn[currentPath] || currentPath;
                newPath = `/en${mappedPath === '/' ? '' : mappedPath}`;
            }
        } else {
            // Switching to Spanish
            // If current path is English (starts with /en), strip it and check mapping
            if (currentPath.startsWith('/en')) {
                const pathWithoutPrefix = currentPath.replace(/^\/en/, '') || '/';
                const mappedPath = enToEs[pathWithoutPrefix] || pathWithoutPrefix;
                newPath = mappedPath;
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

    // Handle menu close with animation
    const handleMenuClose = () => {
        setMenuClosing(true);
        setMenuOpen(false);
        setMenuClosing(false);
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

    const value = {
        hidden,
        setHidden,
        menuOpen,
        setMenuOpen,
        menuClosing,
        menuEntering,
        servicesOpen,
        setServicesOpen,
        supportOpen,
        setSupportOpen,
        activeSection,
        hoverLock,
        setHoverLock,
        hoveredService,
        setHoveredService,
        langOpen,
        setLangOpen,
        langRef,
        isMenuMounted,
        setIsMenuMounted,
        isHero,
        handleNavClick,
        handleLanguageChange,
        handleMenuClose,
        getLocalizedPath,
        navigateWithTransition,
        isFooterVisible,
        setIsFooterVisible
    };

    return (
        <MenuContext.Provider value={value}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};
