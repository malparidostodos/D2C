// ========================================
// DATA STORAGE
// Datos de servicios, precios, detalles
// ========================================

const serviceData = {
    lavado: {
        title: 'LAVADO',
        icon: 'L',
        description: 'Lavado profesional de dos fases con productos premium y tecnología avanzada para un acabado impecable.',
        basePrice: 149,
        details: {
            'Lavado de dos fases': 'Enjabonado inicial y segundo enjabonado para máxima limpieza',
            'Espuma activa': 'Productos de alta calidad que eliminan suciedad sin dañar la pintura',
            'Secado sin marcas': 'Técnica especializada con microfibras premium',
            'Limpieza de llantas': 'Productos especializados para aros y neumáticos',
            'Limpieza de vidrios': 'Interior y exterior con productos anti-vaho',
            'Aplicación de hidratante': 'Protector para molduras y detalles de goma'
        },
        duration: '2-3 horas',
        suitableFor: 'Mantenimiento regular, vehículos nuevos',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    },
    pulido: {
        title: 'PULIDO',
        icon: 'P',
        description: 'Corrección de pintura con máquinas de última generación para eliminar rayones, swirl marks y restaurar el brillo original.',
        basePrice: 349,
        details: {
            'Análisis de pintura': 'Evaluación detallada del estado de la pintura',
            'Corrección de rayones': 'Eliminación de imperfecciones superficiales y profundas',
            'Pulido de una etapa': 'Corrección ligera a moderada de imperfecciones',
            'Pulido multicapa': 'Corrección profunda con múltiples etapas (opcional)',
            'Eliminación de swirl marks': 'Remoción de marcas circulares de la pintura',
            'Restauración de brillo': 'Aplicación de compuestos de pulido profesionales',
            'Protección final': 'Cera o sellador de larga duración'
        },
        duration: '4-8 horas',
        suitableFor: 'Vehículos con rayones, pérdida de brillo, pintura desgastada',
        image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop'
    },
    coating: {
        title: 'COATING',
        icon: 'C',
        description: 'Protección duradera de hasta 5 años con tecnología de nano-cerámica de grado profesional. Protege tu inversión.',
        basePrice: 899,
        details: {
            'Preparación exhaustiva': 'Lavado, descontaminación y pulido previo completo',
            'Aplicación de coating': 'Nano-cerámica de grado profesional',
            'Curación controlada': 'Proceso de curado en ambiente controlado',
            'Protección UV': 'Bloquea hasta 99% de los rayos UV dañinos',
            'Efecto hidrofóbico': 'Repele agua y facilita el mantenimiento',
            'Durabilidad': 'Protección de 2-5 años dependiendo del producto',
            'Garantía escrita': 'Documentación de garantía del fabricante'
        },
        duration: '1-2 días',
        suitableFor: 'Vehículos nuevos, restauraciones, protección de largo plazo',
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop'
    },
    interior: {
        title: 'INTERIOR',
        icon: 'I',
        description: 'Limpieza profunda de tapicería, alfombras, paneles y todos los espacios interiores con productos especializados.',
        basePrice: 199,
        details: {
            'Aspiración profunda': 'Extractor de alta potencia para alfombras y asientos',
            'Limpieza de tapicería': 'Limpieza con vapor y productos especializados',
            'Tratamiento de cuero': 'Limpieza, hidratación y protección de cuero genuino',
            'Limpieza de paneles': 'Productos específicos para cada tipo de material',
            'Limpieza de vidrios': 'Interior con productos anti-vaho y anti-huellas',
            'Desinfección': 'Tratamiento antibacteriano y desodorización',
            'Protección': 'Aplicación de protectores UV para tapicería'
        },
        duration: '3-5 horas',
        suitableFor: 'Vehículos con uso intenso, olores, manchas, mantenimiento periódico',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop'
    }
};

const pricingPackages = {
    basico: {
        name: 'Básico',
        price: 149,
        features: [
            'Lavado exterior premium',
            'Aspirado interior completo',
            'Limpieza de llantas y aros',
            'Secado sin marcas'
        ],
        excluded: [
            'Descontaminación de pintura',
            'Pulido profesional'
        ]
    },
    premium: {
        name: 'Premium',
        price: 349,
        features: [
            'Todo del plan Básico',
            'Descontaminación de pintura',
            'Pulido de una etapa',
            'Limpieza profunda interior',
            'Cera líquida premium'
        ],
        excluded: [
            'Coating cerámico'
        ]
    },
    elite: {
        name: 'Elite',
        price: 899,
        features: [
            'Todo del plan Premium',
            'Pulido multicapa',
            'Coating cerámico 2 años',
            'Protección de vidrios',
            'Tratamiento de llantas',
            'Garantía escrita'
        ],
        excluded: []
    }
};

const quoteOptions = {
    vehicleSize: {
        small: { name: 'Compacto', price: 0 },
        medium: { name: 'Sedán', price: 50 },
        large: { name: 'SUV', price: 100 },
        xlarge: { name: 'Camioneta', price: 150 }
    },
    addons: {
        engine: { name: 'Limpieza de motor', price: 80 },
        headlights: { name: 'Restauración de faros', price: 60 },
        wax: { name: 'Cera premium adicional', price: 100 },
        trim: { name: 'Tratamiento de molduras', price: 50 }
    }
};

// Exportar para uso global
window.serviceData = serviceData;
window.pricingPackages = pricingPackages;
window.quoteOptions = quoteOptions;

