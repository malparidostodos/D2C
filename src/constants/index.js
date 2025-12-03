const flavorlists = [
    {
        name: "Exterior Detailing",
        description: "Restauración y protección de la pintura para un brillo inigualable.",
        features: [
            "Lavado detallado",
            "Descontaminación",
            "Cera protectora",
            "Brillo intenso"
        ],
        price: "$120.000",
        color: "black",
        rotation: "md:rotate-[-2deg] rotate-0",
    },
    {
        name: "Interior Detailing",
        description: "Limpieza profunda y desinfección de cada rincón de tu cabina.",
        features: [
            "Limpieza de tapicería",
            "Vapor",
            "Hidratación de plásticos",
            "Eliminación de olores"
        ],
        price: "$150.000",
        color: "blue",
        rotation: "md:rotate-[2deg] rotate-0",
    },
    {
        name: "Engine Bay Cleaning",
        description: "Limpieza segura y detallada del corazón de tu vehículo.",
        features: [
            "Desengrasado seguro",
            "Protección de plásticos",
            "Acabado satinado",
            "Inspección visual"
        ],
        price: "$60.000",
        color: "red",
        rotation: "md:rotate-[-2deg] rotate-0",
    },
    {
        name: "Paint Correction",
        description: "Eliminación de swirls y arañazos para un acabado espejo.",
        features: [
            "Pulido multi-etapa",
            "Eliminación de rayas",
            "Restauración de brillo",
            "Acabado profesional"
        ],
        price: "$350.000",
        color: "orange",
        rotation: "md:rotate-[2deg] rotate-0",
    },
    {
        name: "Wheel & Tire Detailing",
        description: "Limpieza y protección para tus ruedas.",
        features: [
            "Limpieza profunda de rines",
            "Descontaminación férrica",
            "Brillo de llantas",
            "Protección cerámica"
        ],
        price: "$80.000",
        color: "white",
        rotation: "md:rotate-[-2deg] rotate-0",
    },
    {
        name: "Premium Car Wash",
        description: "Lavado suave y detallado para mantener tu vehículo impecable.",
        features: [
            "Lavado a mano",
            "Secado con aire",
            "Aspirado básico",
            "Limpieza de vidrios"
        ],
        price: "$50.000",
        color: "brown",
        rotation: "md:rotate-[2deg] rotate-0",
    },
];

const processSteps = [
    {
        id: 1,
        title: "Book Your Service",
        description: "Choose your detailing package and schedule a time that works best for you—online or by phone.",
        icon: "calendar",
        color: "bg-yellow-400"
    },
    {
        id: 2,
        title: "We Arrive or You Visit",
        description: "Depending on your preference, bring your vehicle to us or let our mobile team come to your location.",
        icon: "user",
        color: "bg-blue-500"
    },
    {
        id: 3,
        title: "We Detail Your Car",
        description: "Our trained professionals get to work—inside and out—using premium products and meticulous techniques.",
        icon: "spray",
        color: "bg-yellow-400"
    },
    {
        id: 4,
        title: "Enjoy Your Ride",
        description: "Drive away with a spotless, protected vehicle that looks and feels like new.",
        icon: "star",
        color: "bg-blue-500"
    }
];

export { flavorlists, processSteps };
