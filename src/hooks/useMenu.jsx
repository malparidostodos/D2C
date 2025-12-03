import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
    const [activeSection, setActiveSection] = useState('#inicio');
    const [hoverLock, setHoverLock] = useState(false);
    const [hoveredService, setHoveredService] = useState(null);
    const [langOpen, setLangOpen] = useState(false);
    const [isMenuMounted, setIsMenuMounted] = useState(false);

    const { t, i18n } = useTranslation();
    const lastScrollY = useRef(0);
    const scrollingUp = useRef(false);
    const scrollTimeout = useRef(null);
    const langRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { lenis } = useSmoothScroll();

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
        return `${prefix}${path}`;
    };

    const handleNavClick = (e, id, path) => {
        e.preventDefault();
        setMenuOpen(false);
        setServicesOpen(false);

        const localizedPath = getLocalizedPath(path);

        // If it's not a hash link (section), just navigate
        if (!id.startsWith('#')) {
            navigate(localizedPath);
            window.scrollTo(0, 0);
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
            navigate(homePath);
            setTimeout(scrollToElement, 500);
        } else {
            scrollToElement();
        }
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

    const value = {
        hidden,
        setHidden,
        menuOpen,
        setMenuOpen,
        menuClosing,
        menuEntering,
        servicesOpen,
        setServicesOpen,
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
        handleNavClick,
        handleLanguageChange,
        handleMenuClose,
        getLocalizedPath
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
