// ========================================
// INTERACTIVE COMPONENTS
// Lógica de componentes: modales, cotizador, comparador
// ========================================

// ========================================
// SERVICE MODAL
// ========================================
const serviceModal = document.querySelector('[data-service-modal]');
const modalBody = document.querySelector('[data-modal-body]');
const modalClose = document.querySelectorAll('[data-modal-close]');
const serviceDetailsButtons = document.querySelectorAll('[data-service-details]');

// Abrir modal de detalles de servicio
serviceDetailsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const serviceId = button.getAttribute('data-service-details');
        openServiceModal(serviceId);
    });
});

// Cerrar modal
modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
        closeServiceModal();
    });
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
        closeServiceModal();
    }
});

function openServiceModal(serviceId) {
    const service = window.serviceData[serviceId];
    if (!service) return;

    const detailsHTML = `
        <h2 class="modal-service-title">${service.title}</h2>
        <p class="modal-service-description">${service.description}</p>
        
        <div class="modal-service-details">
            <h4>Incluye:</h4>
            <ul>
                ${Object.entries(service.details).map(([key, value]) => `
                    <li>
                        <strong>${key}:</strong> ${value}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="modal-service-details">
            <h4>Información adicional:</h4>
            <ul>
                <li><strong>Duración estimada:</strong> ${service.duration}</li>
                <li><strong>Ideal para:</strong> ${service.suitableFor}</li>
            </ul>
        </div>

        <div class="modal-service-price">
            Desde $${service.basePrice}
        </div>

        <button class="quote-btn" style="width: 100%;" onclick="scrollToQuote()">
            Solicitar Cotización
        </button>
    `;

    modalBody.innerHTML = detailsHTML;
    serviceModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animar contenido
    gsap.from('.modal-content', {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out'
    });
}

function closeServiceModal() {
    serviceModal.classList.remove('active');
    document.body.style.overflow = '';
    
    gsap.to('.modal-content', {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
    });
}

function scrollToQuote() {
    closeServiceModal();
    setTimeout(() => {
        const quoteSection = document.querySelector('[data-quote-builder]');
        if (quoteSection) {
            quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Activar primer paso
            const firstStep = document.querySelector('[data-step="1"]');
            if (firstStep) {
                firstStep.classList.add('active');
            }
        }
    }, 300);
}

window.scrollToQuote = scrollToQuote;

// ========================================
// PRICING COMPARATOR
// ========================================
const comparatorToggle = document.querySelector('[data-comparator-toggle]');
const pricingCards = document.querySelectorAll('[data-pricing-card]');

if (comparatorToggle) {
    comparatorToggle.addEventListener('click', () => {
        comparatorToggle.classList.toggle('active');
        pricingCards.forEach(card => {
            card.classList.toggle('comparison-mode');
        });
    });
}

// ========================================
// PRICING SELECTION
// ========================================
const pricingSelectButtons = document.querySelectorAll('[data-pricing-select]');

pricingSelectButtons.forEach(button => {
    button.addEventListener('click', () => {
        const packageId = button.getAttribute('data-pricing-select');
        selectPricingPackage(packageId);
    });
});

function selectPricingPackage(packageId) {
    // Remover selección previa
    pricingSelectButtons.forEach(btn => {
        btn.textContent = 'Seleccionar';
        btn.style.background = 'var(--color-text)';
    });

    // Marcar como seleccionado
    const selectedButton = document.querySelector(`[data-pricing-select="${packageId}"]`);
    if (selectedButton) {
        selectedButton.textContent = '✓ Seleccionado';
        selectedButton.style.background = '#22c55e';
        
        // Scroll suave al formulario
        setTimeout(() => {
            const contactForm = document.querySelector('[data-contact-form]');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Pre-seleccionar servicio en formulario
                const serviceSelect = document.getElementById('service');
                if (serviceSelect) {
                    serviceSelect.value = packageId;
                }
            }
        }, 500);
    }
}

// ========================================
// QUOTE BUILDER
// ========================================
let currentQuote = {
    basePrice: 149,
    vehicleSize: null,
    addons: [],
    total: 149
};

const quoteOptions = document.querySelectorAll('.quote-option');
const quoteCheckboxes = document.querySelectorAll('.quote-checkbox input[type="checkbox"]');
const quoteTotal = document.querySelector('[data-quote-total]');
const quoteSubmit = document.querySelector('[data-quote-submit]');

// Selección de tamaño de vehículo
quoteOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remover selección previa
        quoteOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Marcar como seleccionado
        option.classList.add('selected');
        const vehicleSize = option.getAttribute('data-vehicle');
        const priceText = option.querySelector('.option-price').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        currentQuote.vehicleSize = vehicleSize;
        currentQuote.basePrice = 149 + price;
        updateQuoteTotal();
        
        // Avanzar al siguiente paso
        setTimeout(() => {
            const step2 = document.querySelector('[data-step="2"]');
            if (step2) {
                step2.classList.add('active');
                gsap.to(step2, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        }, 300);
    });
});

// Selección de addons
quoteCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const addonId = checkbox.getAttribute('data-addon');
        const price = parseInt(checkbox.value);
        
        if (checkbox.checked) {
            currentQuote.addons.push({ id: addonId, price: price });
        } else {
            currentQuote.addons = currentQuote.addons.filter(a => a.id !== addonId);
        }
        
        updateQuoteTotal();
    });
});

function updateQuoteTotal() {
    let total = currentQuote.basePrice;
    currentQuote.addons.forEach(addon => {
        total += addon.price;
    });
    
    currentQuote.total = total;
    
    if (quoteTotal) {
        gsap.to(quoteTotal, {
            text: `$${total}`,
            duration: 0.3,
            ease: 'power2.out',
            snap: { text: 1 }
        });
    }
}

// Enviar cotización
if (quoteSubmit) {
    quoteSubmit.addEventListener('click', () => {
        // Scroll al formulario y pre-llenar
        const contactForm = document.querySelector('[data-contact-form]');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Pre-seleccionar servicio personalizado
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = 'custom';
            }
            
            // Pre-llenar mensaje con detalles de cotización
            const messageTextarea = document.getElementById('message');
            if (messageTextarea) {
                const vehicleName = currentQuote.vehicleSize ? 
                    document.querySelector(`[data-vehicle="${currentQuote.vehicleSize}"] span`).textContent : 
                    'No seleccionado';
                const addonsList = currentQuote.addons.length > 0 ? 
                    currentQuote.addons.map(a => `- ${a.id}`).join('\n') : 
                    'Ninguno';
                
                messageTextarea.value = `Solicito cotización personalizada:\n\n` +
                    `Tamaño del vehículo: ${vehicleName}\n` +
                    `Servicios adicionales:\n${addonsList}\n` +
                    `Total estimado: $${currentQuote.total}\n\n` +
                    `Por favor, contactarme para confirmar disponibilidad y detalles.`;
            }
            
            // Focus en nombre
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) {
                    nameInput.focus();
                }
            }, 500);
        }
    });
}

// ========================================
// FORM ENHANCEMENTS
// ========================================
const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
        const selectedValue = serviceSelect.value;
        const messageTextarea = document.getElementById('message');
        
        if (messageTextarea && selectedValue && !messageTextarea.value) {
            // Pre-llenar mensaje básico
            messageTextarea.value = `Me interesa el servicio: ${serviceSelect.options[serviceSelect.selectedIndex].text}\n\nPor favor, contactarme para agendar una cita.`;
        }
    });
}

// ========================================
// ANIMATIONS ON LOAD
// ========================================
// Asegurar que ScrollTrigger esté registrado
if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.quote-builder', {
        scrollTrigger: {
            trigger: '.quote-builder',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.to('.pricing-comparator', {
        scrollTrigger: {
            trigger: '.pricing-comparator',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

console.log('✨ Componentes interactivos cargados correctamente');

