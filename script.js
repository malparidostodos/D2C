// ========================================
// LUSION-INSPIRED ANIMATIONS
// Animaciones complejas scroll-triggered con GSAP
// ========================================

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// ========================================
// INITIALIZATION - Asegurar que elementos sean visibles
// ========================================
// Función para inicializar elementos visibles si ya están en viewport
function initVisibleElements() {
    const elementsToCheck = document.querySelectorAll('.service-card, [data-pricing-card], .gallery-item, .process-step, .services-subtitle, [data-services-process]');
    
    elementsToCheck.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        
        if (isVisible && parseFloat(getComputedStyle(element).opacity) < 0.1) {
            // Si ya está visible pero aún oculto, animar inmediatamente
            gsap.to(element, {
                opacity: 1,
                y: 0,
                scale: element.classList.contains('gallery-item') ? 1 : undefined,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    element.style.opacity = '1';
                    element.style.transform = element.classList.contains('gallery-item') ? 'scale(1)' : 'translateY(0)';
                }
            });
        }
    });
}

// Ejecutar después de que la página cargue
window.addEventListener('load', () => {
    setTimeout(() => {
        initVisibleElements();
        ScrollTrigger.refresh();
    }, 300);
});

// También ejecutar después de un breve delay para asegurar que GSAP esté listo
setTimeout(() => {
    initVisibleElements();
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 800);

// ========================================
// NAVIGATION
// ========================================
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const floatingCTA = document.querySelector('.floating-cta');
const keepScrolling = document.querySelector('[data-keep-scrolling]');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Mostrar floating CTA después del hero
    if (window.scrollY > window.innerHeight * 0.5) {
        floatingCTA.classList.add('visible');
        keepScrolling.classList.remove('visible');
    } else {
        floatingCTA.classList.remove('visible');
        keepScrolling.classList.add('visible');
    }
});

  // Mobile menu toggle - desde navbar
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    });
}

// Mobile menu toggle - desde botón CLOSE dentro del menú
const mobileMenuClose = document.querySelector('.mobile-menu-close');
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close mobile menu on link click
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Arreglar bug: Asegurar que info toggle funcione
const infoToggle = document.querySelector('[data-info-toggle]');
if (infoToggle) {
    infoToggle.addEventListener('click', () => {
        // Scroll suave al about section
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ========================================
// HERO ANIMATIONS
// ========================================
const heroBadge = document.querySelector('[data-hero-badge]');
const heroTitle = document.querySelector('[data-hero-title]');
const titleLines = document.querySelectorAll('[data-title-line]');
const scrollIndicator = document.querySelector('[data-scroll-indicator]');
const heroVideo = document.querySelector('.hero-video');

// Animar badge
gsap.to(heroBadge, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0.3
});

// Animar palabras del título una por una
titleLines.forEach((line, lineIndex) => {
    const words = line.querySelectorAll('.word');
    words.forEach((word, wordIndex) => {
        gsap.to(word, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: lineIndex * 0.15 + wordIndex * 0.08 + 0.5,
            ease: 'power3.out'
        });
    });
});

// Animar scroll indicator
gsap.to(scrollIndicator, {
    opacity: 0.7,
    y: 0,
    duration: 1,
    delay: 2,
    ease: 'power2.out'
});

// Parallax video
gsap.to(heroVideo, {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    scale: 1.15,
    y: 100,
    ease: 'none'
});

// ========================================
// ABOUT SECTION ANIMATIONS
// ========================================
const aboutTitle = document.querySelector('[data-about-title]');
const aboutDescription = document.querySelector('[data-about-description]');
const aboutLink = document.querySelector('[data-about-link]');

if (aboutTitle) {
    const words = aboutTitle.querySelectorAll('.word');
    words.forEach((word, index) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

gsap.to(aboutDescription, {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power2.out'
});

gsap.to(aboutLink, {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.8,
    ease: 'power2.out'
});

// ========================================
// SERVICES SECTION ANIMATIONS
// ========================================
const sectionLabel = document.querySelector('[data-section-label]');
const servicesTitles = document.querySelectorAll('[data-services-title]');
const servicesSubtitle = document.querySelector('[data-services-subtitle]');
const serviceCards = document.querySelectorAll('[data-service-card]');
const servicesFooter = document.querySelector('[data-services-footer]');

// Animar label
if (sectionLabel) {
    gsap.to(sectionLabel, {
        scrollTrigger: {
            trigger: '.services',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0.4,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
}

// Animar títulos de servicios
servicesTitles.forEach((title, titleIndex) => {
    const words = title.querySelectorAll('.word');
    words.forEach((word, wordIndex) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: titleIndex * 0.2 + wordIndex * 0.06,
            ease: 'power3.out'
        });
    });
});

// Animar subtítulo de servicios
if (servicesSubtitle) {
    servicesSubtitle.style.animation = 'none';
    
    const rect = servicesSubtitle.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(servicesSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                servicesSubtitle.style.opacity = '1';
                servicesSubtitle.style.transform = 'translateY(0)';
            }
        });
    } else {
        gsap.to(servicesSubtitle, {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                servicesSubtitle.style.opacity = '1';
                servicesSubtitle.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(servicesSubtitle).opacity) < 0.1) {
            gsap.to(servicesSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 1500);
}

// Animar tarjetas de servicios
serviceCards.forEach((card, index) => {
    // Remover animación fallback si GSAP está activo
    card.style.animation = 'none';
    
    // Verificar si el elemento ya está visible
    const rect = card.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        // Si ya está visible, animar inmediatamente
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power2.out',
            onComplete: () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    } else {
        // Si no está visible, usar ScrollTrigger
        gsap.to(card, {
        scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            onComplete: () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad: mostrar después de delay
    setTimeout(() => {
        if (parseFloat(getComputedStyle(card).opacity) < 0.1) {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 1500 + (index * 100));
    
    // Parallax en imágenes manejado por parallax.js para evitar duplicados
});

// Animar footer de servicios
gsap.to(servicesFooter, {
    scrollTrigger: {
        trigger: '.services',
        start: 'bottom 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
});

// ========================================
// PRICING SECTION ANIMATIONS
// ========================================
const pricingTitle = document.querySelector('[data-pricing-title]');
const pricingSubtitle = document.querySelector('[data-pricing-subtitle]');
const pricingCardsElements = document.querySelectorAll('[data-pricing-card]');

// Animar título de precios
if (pricingTitle) {
    const words = pricingTitle.querySelectorAll('.word');
    words.forEach((word, index) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.pricing',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                once: true
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// Animar subtítulo de precios
if (pricingSubtitle) {
    pricingSubtitle.style.animation = 'none';
    
    const rect = pricingSubtitle.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(pricingSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                pricingSubtitle.style.opacity = '1';
                pricingSubtitle.style.transform = 'translateY(0)';
            }
        });
    } else {
        gsap.to(pricingSubtitle, {
            scrollTrigger: {
                trigger: '.pricing',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                pricingSubtitle.style.opacity = '1';
                pricingSubtitle.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(pricingSubtitle).opacity) < 0.1) {
            gsap.to(pricingSubtitle, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 1500);
}

// Animar tarjetas de precios
pricingCardsElements.forEach((card, index) => {
    // Remover animación fallback si GSAP está activo
    card.style.animation = 'none';
    
    // Verificar si ya está visible
    const rect = card.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3 + index * 0.08,
            ease: 'power2.out',
            onComplete: () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    } else {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.pricing',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.5 + index * 0.1,
            ease: 'power3.out',
            onComplete: () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(card).opacity) < 0.1) {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 2000 + (index * 100));
});

// ========================================
// SERVICES PROCESS SECTION ANIMATIONS (integrado)
// ========================================
const servicesProcess = document.querySelector('[data-services-process]');
const processTitles = document.querySelectorAll('[data-process-title]');
const processSteps = document.querySelectorAll('.process-step');

// Animar sección de proceso integrada
if (servicesProcess) {
    servicesProcess.style.animation = 'none';
    
    const rect = servicesProcess.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(servicesProcess, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power2.out',
            onComplete: () => {
                servicesProcess.style.opacity = '1';
                servicesProcess.style.transform = 'translateY(0)';
            }
        });
    } else {
        gsap.to(servicesProcess, {
            scrollTrigger: {
                trigger: servicesProcess,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                servicesProcess.style.opacity = '1';
                servicesProcess.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(servicesProcess).opacity) < 0.1) {
            gsap.to(servicesProcess, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 2000);
}

// Animar títulos del proceso
processTitles.forEach((title, titleIndex) => {
    const words = title.querySelectorAll('.word');
    words.forEach((word, wordIndex) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: title.closest('.services-process') || title,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: titleIndex * 0.2 + wordIndex * 0.06,
            ease: 'power3.out'
      });
    });
});

// Animar pasos del proceso (ahora dentro de services)
processSteps.forEach((step, index) => {
    // Remover animación fallback si GSAP está activo
    step.style.animation = 'none';
    
    const rect = step.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(step, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            onComplete: () => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }
        });
    } else {
        gsap.to(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            onComplete: () => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(step).opacity) < 0.1) {
            gsap.to(step, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 2500 + (index * 120));
});

// ========================================
// GALLERY SECTION ANIMATIONS
// ========================================
const galleryTitles = document.querySelectorAll('[data-gallery-title]');
const galleryItems = document.querySelectorAll('[data-gallery-item]');

// Animar títulos de galería
galleryTitles.forEach((title, titleIndex) => {
    const words = title.querySelectorAll('.word');
    words.forEach((word, wordIndex) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.gallery',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: titleIndex * 0.2 + wordIndex * 0.06,
            ease: 'power3.out'
      });
    });
});

// Animar items de galería
galleryItems.forEach((item, index) => {
    // Remover animación fallback si GSAP está activo
    item.style.animation = 'none';
    
    // Verificar si ya está visible
    const rect = item.getBoundingClientRect();
    const isAlreadyVisible = rect.top < window.innerHeight * 0.9;
    
    if (isAlreadyVisible) {
        gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power2.out',
            onComplete: () => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }
    });
  } else {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                once: true
            },
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            onComplete: () => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }
        });
    }
    
    // Fallback de seguridad
    setTimeout(() => {
        if (parseFloat(getComputedStyle(item).opacity) < 0.1) {
            gsap.to(item, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }, 2500 + (index * 100));
    
    // Parallax en imágenes manejado por parallax.js para evitar duplicados
});

// ========================================
// CTA SECTION ANIMATIONS
// ========================================
const ctaTitles = document.querySelectorAll('[data-cta-title]');
const ctaSubtitle = document.querySelector('[data-cta-subtitle]');
const ctaButton = document.querySelector('[data-cta-button]');

// Animar títulos CTA
ctaTitles.forEach((title, titleIndex) => {
    const words = title.querySelectorAll('.word');
    words.forEach((word, wordIndex) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: titleIndex * 0.2 + wordIndex * 0.06,
            ease: 'power3.out'
        });
    });
});

gsap.to(ctaSubtitle, {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out'
});

gsap.to(ctaButton, {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.8,
    ease: 'power2.out'
});

// ========================================
// CONTACT SECTION ANIMATIONS
// ========================================
const contactTitle = document.querySelector('[data-contact-title]');
const contactSubtitle = document.querySelector('[data-contact-subtitle]');
const contactInfo = document.querySelector('[data-contact-info]');
const contactForm = document.querySelector('[data-contact-form]');
const contactItems = document.querySelectorAll('.contact-item');
const formGroups = document.querySelectorAll('.form-group');

// Animar título de contacto
if (contactTitle) {
    const words = contactTitle.querySelectorAll('.word');
    words.forEach((word, index) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

gsap.to(contactSubtitle, {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out'
});

// Animar items de contacto
contactItems.forEach((item, index) => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.7 + index * 0.1,
        ease: 'power2.out'
    });
});

// Animar grupos de formulario
formGroups.forEach((group, index) => {
    gsap.to(group, {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 1 + index * 0.1,
        ease: 'power2.out'
    });
});

// ========================================
// FOOTER ANIMATIONS
// ========================================
gsap.to('.footer', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            if (mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
  });

// ========================================
// KEEP SCROLLING INDICATOR
// ========================================
ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom bottom',
    onEnter: () => {
        keepScrolling.classList.remove('visible');
    },
    onLeaveBack: () => {
        keepScrolling.classList.add('visible');
    }
});

// Parallax effects están en parallax.js

// ========================================
// CURSOR EFFECT (opcional, estilo Lusion)
// ========================================
let cursor = document.querySelector('.custom-cursor');
if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
}

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
});

document.addEventListener('mouseenter', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
        gsap.to(cursor, {
            scale: 2,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
});

document.addEventListener('mouseleave', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
});

// ========================================
// FORM SUBMISSION
// ========================================
const contactFormElement = document.querySelector('.contact-form');
if (contactFormElement) {
    contactFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío del formulario
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
        contactFormElement.reset();
    });
}

// ========================================
// PERFORMANCE: Lazy load images
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;
    
    // Implementación simple de typewriter sin librería externa
    const words = ['premium', 'profesional', 'excepcional'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = '';
    let cursorVisible = true;
    
    // Mostrar cursor inicial
    typewriterElement.textContent = '';
    
    function type() {
        const current = words[wordIndex];
        
        if (isDeleting) {
            currentWord = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentWord = current.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Actualizar texto con cursor
        typewriterElement.textContent = currentWord;
        
        // Agregar cursor visualmente
        if (!isDeleting) {
            typewriterElement.textContent = currentWord + (cursorVisible ? '|' : '');
            cursorVisible = !cursorVisible;
        } else {
            typewriterElement.textContent = currentWord + '|';
        }
        
        let typeSpeed = isDeleting ? 30 : 75;
        
        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000; // Pausa al completar palabra
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Iniciar después de un delay
    setTimeout(() => {
        type();
    }, 2000);
}

// Inicializar después de que cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTypewriter();
    });
} else {
    initTypewriter();
}

// ========================================
// GENERATING COMPONENT
// ========================================
function showGenerating(text = 'Procesando...') {
    const component = document.getElementById('generatingComponent');
    const textElement = component.querySelector('.generating-text');
    if (component && textElement) {
        textElement.textContent = text;
        component.style.display = 'flex';
        setTimeout(() => {
            component.classList.add('show');
        }, 10);
    }
}

function hideGenerating() {
    const component = document.getElementById('generatingComponent');
    if (component) {
        component.classList.remove('show');
        setTimeout(() => {
            component.style.display = 'none';
        }, 300);
    }
}

// Ejemplo de uso: mostrar generating al hacer clic en botones
document.querySelectorAll('.pricing-btn, .quote-btn, .service-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showGenerating('Procesando solicitud...');
        setTimeout(() => {
            hideGenerating();
        }, 2000);
    });
});

// ========================================
// NOTIFICATION COMPONENT
// ========================================
function showNotification(title, message, duration = 3000) {
    const component = document.getElementById('notificationComponent');
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');
    
    if (component && titleElement && messageElement) {
        titleElement.textContent = title;
        messageElement.textContent = message;
        component.style.display = 'block';
        
        setTimeout(() => {
            component.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            hideNotification();
        }, duration);
    }
}

function hideNotification() {
    const component = document.getElementById('notificationComponent');
    if (component) {
        component.classList.remove('show');
        setTimeout(() => {
            component.style.display = 'none';
        }, 400);
    }
}

// Ejemplo: mostrar notificación al seleccionar un paquete
document.querySelectorAll('[data-pricing-select]').forEach(btn => {
    btn.addEventListener('click', () => {
        const packageName = btn.closest('.pricing-card').querySelector('.pricing-name').textContent;
        showNotification('Paquete seleccionado', `Has seleccionado el paquete ${packageName}`);
    });
});

// Ejemplo: mostrar notificación al enviar formulario
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showGenerating('Enviando mensaje...');
        setTimeout(() => {
            hideGenerating();
            showNotification('Mensaje enviado', 'Te contactaremos pronto');
            contactForm.reset();
        }, 2000);
    });
}

// ========================================
// ENHANCED BUTTON EFFECTS
// ========================================
document.querySelectorAll('.pricing-btn, .quote-btn, .service-details-btn, .nav-cta-btn').forEach(btn => {
    btn.classList.add('enhanced-button');
});

// ========================================
// PARALLAX EFFECTS PARA BACKGROUND CIRCLES
// ========================================
function initParallaxCircles() {
    const circles = document.getElementById('backgroundCircles');
    if (!circles) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });
    
    function animate() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        circles.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Inicializar parallax
initParallaxCircles();

// ========================================
// BENEFITS SECTION ANIMATIONS
// ========================================
function initBenefitsAnimations() {
    const benefitCards = document.querySelectorAll('[data-benefit-card]');
    
    benefitCards.forEach((card, index) => {
        // Establecer imagen de fondo desde atributo
        const bgUrl = card.getAttribute('data-benefit-bg');
        if (bgUrl) {
            card.style.setProperty('--benefit-bg-image', `url('${bgUrl}')`);
        }
        
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// ========================================
// COLLABORATION SECTION ANIMATIONS
// ========================================
function initCollaborationAnimations() {
    const collabIcons = document.querySelectorAll('.collab-app-icon');
    
    collabIcons.forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon.closest('.collaboration-visual'),
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0,
            duration: 0.5,
            delay: index * 0.05,
            ease: 'back.out(1.7)'
        });
    });
}

// ========================================
// ROADMAP SECTION ANIMATIONS
// ========================================
function initRoadmapAnimations() {
    const roadmapCards = document.querySelectorAll('[data-roadmap-card]');
    
    roadmapCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// Inicializar todas las animaciones
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initBenefitsAnimations();
            initCollaborationAnimations();
            initRoadmapAnimations();
        }, 500);
    });
} else {
    setTimeout(() => {
        initBenefitsAnimations();
        initCollaborationAnimations();
        initRoadmapAnimations();
    }, 500);
}

// ========================================
// FOOTER YEAR UPDATE
// ========================================
const footerYear = document.querySelector('.footer-year');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// ========================================
// CONSOLE LOG
// ========================================
console.log('✨ Elite Car Detailing - Animaciones Lusion cargadas correctamente');
console.log('✨ Brainwave components integrados');
