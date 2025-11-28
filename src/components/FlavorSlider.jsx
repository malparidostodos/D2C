import { useGSAP } from "@gsap/react";
import { flavorlists } from "../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import AnimatedButton from "./AnimatedButton";
import { useTranslation } from 'react-i18next';

const FlavorSlider = () => {
    const { t } = useTranslation();
    const sliderRef = useRef();

    const isTablet = useMediaQuery({
        query: "(max-width: 1024px)",
    });

    useGSAP(() => {
        const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;

        if (!isTablet) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: "2% top",
                    end: `+=${scrollAmount + 1500}px`,
                    scrub: true,
                    pin: true,
                },
            });

            tl.to(".flavor-section", {
                x: `-${scrollAmount + 1500}px`,
                ease: "power1.inOut",
            });
        }

        const titleTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".flavor-section",
                start: "top top",
                end: "bottom 80%",
                scrub: true,
            },
        });

        titleTl
            .to(".first-text-split", {
                xPercent: -30,
                ease: "power1.inOut",
            })
            .to(
                ".flavor-text-scroll",
                {
                    xPercent: -22,
                    ease: "power1.inOut",
                },
                "<"
            )
            .to(
                ".second-text-split",
                {
                    xPercent: -10,
                    ease: "power1.inOut",
                },
                "<"
            );
    });

    const getServiceTranslation = (flavorName) => {
        const keyMap = {
            'Lavado Premium': 'premium_wash',
            'Coating Cerámico': 'ceramic_coating',
            'Corrección Pintura': 'paint_correction',
            'Detailing Interior': 'interior_detailing',
            'Lavado Básico': 'basic_wash'
        };
        const key = keyMap[flavorName] || 'basic_wash';
        return {
            name: t(`flavor_slider.services.${key}.name`),
            description: t(`flavor_slider.services.${key}.description`),
            features: t(`flavor_slider.services.${key}.features`, { returnObjects: true })
        };
    };

    return (
        <div ref={sliderRef} className="slider-wrapper">
            <div className="flavors">
                {flavorlists.map((flavor, index) => {
                    const translatedService = getServiceTranslation(flavor.name);
                    return (
                        <div
                            key={flavor.name}
                            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation} group`}
                        >
                            <div className="w-full h-full bg-[#0a0a0a] rounded-3xl p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden shadow-2xl">
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                {/* Recommended Badge */}
                                {index === 0 && (
                                    <div className="absolute top-6 left-6 bg-blue-900/80 text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                        {t('flavor_slider.recommended')}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="mt-8 z-10 flex flex-col h-full">
                                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{translatedService.name}</h1>
                                    <p className="text-gray-400 text-base mb-6 line-clamp-3">{translatedService.description}</p>

                                    <ul className="space-y-3 mb-auto">
                                        {translatedService.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-300 text-sm">
                                                <span className="text-blue-500 mr-3 text-lg">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Footer */}
                                    <div className="flex items-end justify-between border-t border-white/10 pt-6 mt-4">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('flavor_slider.from')}</p>
                                            <p className="text-3xl font-bold text-white">{flavor.price}</p>
                                        </div>
                                        <AnimatedButton
                                            href="/reserva"
                                            variant="white"
                                            className="!px-6 !py-3 !text-sm"
                                            state={{
                                                selectedService: (() => {
                                                    const serviceMap = {
                                                        'Lavado Premium': { id: 'premium', name: translatedService.name, price: 120000, description: translatedService.description, features: translatedService.features },
                                                        'Coating Cerámico': { id: 'ceramic', name: translatedService.name, price: 800000, description: translatedService.description, features: translatedService.features },
                                                        'Corrección Pintura': { id: 'ceramic', name: translatedService.name, price: 800000, description: translatedService.description, features: translatedService.features },
                                                        'Detailing Interior': { id: 'interior', name: translatedService.name, price: 250000, description: translatedService.description, features: translatedService.features }
                                                    }
                                                    return serviceMap[flavor.name] || { id: 'basic', name: translatedService.name, price: 50000, description: translatedService.description, features: translatedService.features }
                                                })()
                                            }}
                                        >
                                            {t('flavor_slider.book')}
                                        </AnimatedButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlavorSlider;
