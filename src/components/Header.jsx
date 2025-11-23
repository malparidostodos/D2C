import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Home, ChevronDown } from 'lucide-react';
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

  // -------------------------------------------------
  // Mouse‑move & scroll visibility handling
  // -------------------------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      const isAtTop = window.scrollY < 50;
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

    const handleScrollVisibility = () => {
      const currentScrollY = window.scrollY;
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
    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollVisibility);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [hoverLock, menuOpen]);

  // -------------------------------------------------
  // Scroll‑spy
  // -------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        '#inicio',
        '#beneficios',
        '#colaboracion',
        '#servicios',
        '#roadmap',
        '#membresias',
        '#contacto',
      ];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

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

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INICIO', path: '/inicio', id: '#inicio' },
    { name: 'CONTACTO', path: '/contacto', id: '#contacto' },
  ];

  const servicesDropdown = [
    { name: 'Precios', path: '/servicios', id: '#servicios' },
    { name: 'Proceso', path: '/roadmap', id: '#roadmap' },
    { name: 'Membresías', path: '/membresias', id: '#membresias' },
  ];

  const handleNavClick = (e, id, path) => {
    e.preventDefault();
    setMenuOpen(false);
    setServicesOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      const element = document.querySelector(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isServiceActive = ['#servicios', '#roadmap', '#membresias'].includes(activeSection);

  // Use black theme class if desired, or default orange
  const themeClass = 'jeton-black-theme';

  return (
    <>
      {/* Shadow hint */}
      <div
        className={`fixed -bottom-24 left-1/2 -translate-x-1/2 w-[60vw] h-24 bg-white/20 blur-[80px] rounded-t-full pointer-events-none transition-opacity duration-700 ${hidden ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 40 }}
      />

      {/* Main Menu Structure */}
      <div
        className={`_menu ${themeClass}`}
        style={{ transform: hidden ? 'translateY(250%)' : 'translateY(0)', transition: 'transform 0.35s ease-in-out' }}
      >
        <div
          className="menu-bar"
          onMouseEnter={() => { setHoverLock(true); setHidden(false); }}
          onMouseLeave={() => { setHoverLock(false); setHoveredService(null); }}
        >
          {/* INICIO */}
          <button
            className={`_menu-button ${activeSection === '#inicio' ? '-active -exact' : ''}`}
            onClick={(e) => handleNavClick(e, '#inicio', '/inicio')}
          >
            <div className="background"></div>
            <Home size={20} strokeWidth={2} />
          </button>

          {/* SERVICIOS Dropdown Trigger */}
          <button
            className={`_menu-button ${isServiceActive ? '-active -exact' : ''}`}
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            <div className="background"></div>
            <span>Personal</span>
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              style={{ marginLeft: 4, transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </button>

          {/* The Drawer (Dropup) */}
          <div className="_menu-drawer">
            <div className="slot">
              <ul>
                {servicesDropdown.map((item, index) => (
                  <li
                    key={item.name}
                    onMouseEnter={() => setHoveredService(item.id)}
                  >
                    <a
                      href={item.path}
                      onClick={(e) => handleNavClick(e, item.id, item.path)}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Preview Image */}
              <div className={`menu-preview ${hoveredService ? 'active' : ''}`}>
                {hoveredService === '#servicios' && (
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
          >
            <div className="background"></div>
            <span>Contacto</span>
          </button>

          {/* HABLEMOS CTA */}
          <button
            className="_menu-button hidden md:flex"
            style={{ marginLeft: 8, backgroundColor: 'white', color: 'black', borderRadius: '9999px', paddingLeft: 20, paddingRight: 20 }}
            onClick={(e) => handleNavClick(e, '#contacto', '/contacto')}
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