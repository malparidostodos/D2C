// ========================================
// PARALLAX EFFECTS - Estilo Jeton
// Múltiples capas con diferentes velocidades
// ========================================

gsap.registerPlugin(ScrollTrigger);

// ========================================
// PARALLAX MULTI-CAPA ESTILO JETON
// ========================================

// Parallax en imágenes de servicios - MUY SUTIL
const serviceImages = document.querySelectorAll('.service-image img');
serviceImages.forEach((img, index) => {
    const card = img.closest('.service-card');
    
    if (card && window.innerWidth > 768) {
        ScrollTrigger.create({
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                // Efecto muy sutil para no romper el layout
                gsap.set(img, {
                    y: -20 * progress,
                    scale: 1 + (0.02 * progress)
                });
            }
        });
    }
});

// Parallax en imágenes de galería - MUY SUTIL
const galleryImages = document.querySelectorAll('.gallery-item img');
galleryImages.forEach((img, index) => {
    const item = img.closest('.gallery-item');
    
    if (item && window.innerWidth > 768) {
        ScrollTrigger.create({
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                // Efecto muy sutil
                gsap.set(img, {
                    y: -30 * progress,
                    scale: 1 + (0.03 * progress)
                });
            }
        });
    }
});

// Parallax en tarjetas de precios - DESHABILITADO (mueve tarjetas de forma incorrecta)
// if (window.innerWidth > 768) {
//     const pricingCardsParallax = document.querySelectorAll('[data-pricing-card]');
//     pricingCardsParallax.forEach((card, index) => {
//         const speed = 0.2 + (index * 0.1);
//         const offset = (index - 1) * 20;
//         
//         ScrollTrigger.create({
//             trigger: card,
//             start: 'top bottom',
//             end: 'bottom top',
//             scrub: 1,
//             onUpdate: (self) => {
//                 const progress = self.progress;
//                 gsap.set(card, {
//                     y: (-50 * speed + offset) * progress,
//                     rotation: (index - 1) * 0.5 * progress
//                 });
//             }
//         });
//     });
// }

// Parallax en pasos del proceso - DESHABILITADO (causa problemas)
// const processSteps = document.querySelectorAll('.process-step');
// processSteps.forEach((step, index) => {
//     const speed = 0.25 + (index * 0.1);
//     const direction = index % 2 === 0 ? 1 : -1;
//     
//     gsap.to(step, {
//         scrollTrigger: {
//             trigger: step,
//             start: 'top bottom',
//             end: 'bottom top',
//             scrub: 1
//         },
//         x: 40 * speed * direction,
//         y: -30 * speed,
//         ease: 'none'
//     });
// });

// ========================================
// SMOOTH SCROLL PIN EFFECTS (estilo Jeton)
// ========================================

// Pin effect DESHABILITADO - causa problemas de layout
// if (window.innerWidth > 768) {
//     ScrollTrigger.create({
//         trigger: '.hero',
//         start: 'top top',
//         end: '+=50%',
//         pin: true,
//         pinSpacing: true,
//         scrub: 1,
//         onUpdate: (self) => {
//             const progress = self.progress;
//             const heroContent = document.querySelector('.hero-content');
//             if (heroContent) {
//                 gsap.set(heroContent, {
//                     opacity: Math.max(0, 1 - progress * 0.6),
//                     y: progress * 80
//                 });
//             }
//         }
//     });
// }

// Pin effect deshabilitado temporalmente para evitar conflictos
// Se puede activar si se necesita efecto específico

// ========================================
// TEXT REVEAL EFFECTS (estilo Jeton)
// ========================================

// Split text reveal - DESHABILITADO (ya está en script.js)
// const largeTitles = document.querySelectorAll('.hero-title, .services-title, .pricing-title, .gallery-title');
// ...

// Floating effect deshabilitado - puede causar conflictos con scroll
// Se puede activar solo en hover si se desea

// Image zoom ya está incluido en parallax de servicios y galería arriba

// ========================================
// SMOOTH REVEAL ON SCROLL (estilo Jeton)
// ========================================

// Reveal elements ya está manejado en script.js para evitar duplicados
// Este código está comentado para evitar conflictos

// ========================================
// PARALLAX LAYERS (Background Elements)
// ========================================

// Parallax layers - DESHABILITADO
// const parallaxLayers = document.querySelectorAll('.service-header, .pricing-header');
// ...

// ========================================
// CURSOR PARALLAX - DESHABILITADO (causa conflictos)
// ========================================
// if (window.innerWidth > 768) {
//     const cards = document.querySelectorAll('.service-card, .pricing-card');
//     ...
// }

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Refresh ScrollTriggers on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

console.log('✨ Parallax effects estilo Jeton cargados');

