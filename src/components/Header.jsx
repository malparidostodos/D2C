import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Home, ChevronDown } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';
import './JetonHeader.css'; // Import the strict CSS

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');
  const [hoverLock, setHoverLock] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);
  const lastScrollY = useRef(0);
  const scrollingUp = useRef(false);
  const scrollTimeout = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lenis } = useSmoothScroll();

  // -------------------------------------------------
  // Mouse‑move & scroll visibility handling
  // -------------------------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
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

  const handleNavClick = (e, id, path) => {
    e.preventDefault();
    setMenuOpen(false);
    setServicesOpen(false);

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
            const headerOffset = 80;
            lenis.scrollTo(element, { offset: -headerOffset });
          } else {
            // Calculate position with offset for the fixed header
            const headerOffset = 80; // Approximate header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 500);
    } else {
      scrollToElement();
    }
  };

  const isServiceActive = ['#precios', '#roadmap', '#membresias'].includes(activeSection);

  const navLinks = [
    { name: 'INICIO', id: '#inicio', path: '/inicio' },
    { name: 'CONTACTO', id: '#contacto', path: '/contacto' },
  ];

  const servicesDropdown = [
    { name: 'Precios', path: '/precios', id: '#precios' },
    { name: 'Proceso', id: '#roadmap', path: '/roadmap' },
    { name: 'Membresías', id: '#membresias', path: '/membresias' },
  ];

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
          <a href="/" className="text-xl font-display font-bold text-white tracking-tighter">
            DIRTY<span className="text-accent">2</span>CLEAN
          </a>

          <div className="lang-cta-wrapper">
            {/* Language Selector (Updated Structure) */}
            <div className="_dropdown _language-select hidden md:flex" aria-expanded="false" role="button">
              <button className="_dropdown-button w-full flex items-center justify-center gap-2" data-button="" data-tone="orange" data-variant="outline" data-expanded="false">
                <div data-button-background=""></div>
                <span className="_icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                    <path d="M12 22C17.5228 22 22 17.5229 22 12C22 6.47716 17.5228 2 12 2C6.47715 2 2 6.47716 2 12C2 17.5229 6.47715 22 12 22Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M3 9H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M3 15H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 2C14.5013 4.73836 15.9228 8.29204 16 12C15.9228 15.708 14.5013 19.2617 12 22C9.49872 19.2617 8.07725 15.708 8 12C8.07725 8.29204 9.49872 4.73836 12 2V2Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <span className="">EN</span>
                <span className="_icon chevron">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 13.9393L6.53033 8.46967L5.46967 9.53033L10.409 14.4697C11.2877 15.3483 12.7123 15.3484 13.591 14.4697L18.5303 9.53033L17.4697 8.46967L12 13.9393Z" data-mode="fill" fill="currentColor"></path>
                  </svg>
                </span>
              </button>
              <div className="overlay-container absolute mt-10 hidden">
                <div className="overlay" data-lenis-prevent=""></div>
                <div className="overlay-fade absolute inset-0"></div>
              </div>
            </div>

            {/* CTAs */}
            <div className="ctas hidden md:flex">
              <a href="/login" className="_button" data-variant="ghost">
                <span className="staggered-wrapper">
                  {"Log in".split("").map((char, i) => (
                    <span key={i} className="staggered-char" data-char={char} style={{ "--index": i }}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Structure (Bottom Pill) */}
      <div
        className={`_menu`}
        style={{ transform: hidden ? 'translateY(250%)' : 'translateY(0)', transition: 'transform 0.35s ease-in-out' }}
      >
        <div
          className="menu-bar"
          onMouseEnter={() => { setHoverLock(true); setHidden(false); }}
          onMouseLeave={() => { setHoverLock(false); setHoveredService(null); setServicesOpen(false); }}
        >
          {/* INICIO */}
          <button
            className={`_menu-button ${activeSection === '#inicio' ? '-active -exact' : ''}`}
            onClick={(e) => handleNavClick(e, '#inicio', '/inicio')}
            onMouseEnter={() => setServicesOpen(false)}
          >
            <div className="background"></div>
            <Home size={20} strokeWidth={2} />
          </button>

          {/* SERVICIOS Dropdown Trigger */}
          <button
            className={`_menu-button ${isServiceActive ? '-active -exact' : ''}`}
            aria-expanded={servicesOpen}
            onMouseEnter={() => setServicesOpen(true)}
          >
            <div className="background"></div>
            <span>Personal</span>
            <ChevronDown
              className={`chevron-icon ${servicesOpen ? 'open' : ''}`}
              size={14}
              strokeWidth={2.5}
              style={{ marginLeft: 4 }}
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
                      href={item.path}
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
                    Precios
                  </div>
                )}
                {hoveredService === '#roadmap' && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    Proceso
                  </div>
                )}
                {hoveredService === '#membresias' && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    Membresías
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <button
            className={`_menu-button ${activeSection === '#contacto' ? '-active -exact' : ''}`}
            onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
            onMouseEnter={() => setServicesOpen(false)}
          >
            <div className="background"></div>
            <span>Contacto</span>
          </button>

          {/* HABLEMOS CTA */}
          <button
            className="_menu-button hidden md:flex"
            style={{ marginLeft: 8, backgroundColor: 'white', color: 'black', borderRadius: '9999px', paddingLeft: 20, paddingRight: 20 }}
            onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
            onMouseEnter={() => setServicesOpen(false)}
          >
            <span style={{ fontWeight: 700, marginRight: 4 }}>Hablemos</span>
            <span style={{ fontWeight: 900 }}>·</span>
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.id, link.path)}
              className="text-3xl font-display font-bold text-white hover:text-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          {servicesDropdown.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.id, item.path)}
              className="text-2xl font-display font-bold text-white/70 hover:text-accent transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a
            href="/contacto"
            onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
            className="text-3xl font-display font-bold text-accent"
          >
            HABLEMOS
          </a>
        </div>
      )}
    </>
  );
};

export default Header;