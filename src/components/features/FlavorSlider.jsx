import { useGSAP } from "@gsap/react";
import { flavorlists } from "../../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import AnimatedButton from "../ui/AnimatedButton";
import { useTranslation } from 'react-i18next';
import ProcessSteps from "./ProcessSteps";

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
                id: "flavorScroll",
                scrollTrigger: {
                    trigger: ".flavor-section",
                    start: "2% top",
                    end: `+=${scrollAmount + 1500}px`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.to(".flavor-section", {
                x: `-${scrollAmount + 1500}px`,
                ease: "none",
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
            'Interior Detailing': 'interior_detailing',
            'Paint Correction': 'paint_correction',
            'Exterior Detailing': 'exterior_detailing',
            'Engine Bay Cleaning': 'engine_cleaning',
            'Wheel & Tire Detailing': 'wheel_tire_detailing',
            'Premium Car Wash': 'premium_car_wash'
        };
        const key = keyMap[flavorName] || 'premium_car_wash';
        return {
            name: t(`flavor_slider.services.${key}.name`),
            description: t(`flavor_slider.services.${key}.description`),
            features: t(`flavor_slider.services.${key}.features`, { returnObjects: true })
        };
    };

    return (
        <div ref={sliderRef} className="slider-wrapper w-full h-full">
            <div className="flavors flex lg:flex overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-4 px-4 lg:px-0 h-full items-center">
                {flavorlists.map((flavor, index) => {
                    const translatedService = getServiceTranslation(flavor.name);
                    return (
                        <div
                            key={flavor.name}
                            id={`flavor-${index}`}
                            className={`relative z-30 lg:w-[50vw] w-[85vw] max-w-sm lg:max-w-none lg:h-[70vh] md:w-[60vw] md:h-[50vh] h-[450px] flex-none ${flavor.rotation} group snap-center`}
                        >
                            <div className="w-full h-full bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden shadow-2xl">
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                {/* Recommended Badge */}
                                {index === 0 && (
                                    <div className="absolute top-6 left-6 bg-blue-900/80 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                        {t('flavor_slider.recommended')}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="mt-8 z-10 flex flex-col h-full">
                                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">{translatedService.name}</h1>
                                    <p className="text-gray-400 text-sm md:text-base mb-6 line-clamp-3">{translatedService.description}</p>

                                    <ul className="space-y-3 mb-auto">
                                        {translatedService.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-300 text-xs md:text-sm">
                                                <span className="text-blue-500 mr-3 text-lg">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Footer */}
                                    <div className="flex items-end justify-between border-t border-white/10 pt-6 mt-4">
                                        <div>
                                            <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider mb-1">{t('flavor_slider.from')}</p>
                                            <p className="text-2xl md:text-3xl font-semibold text-white">{flavor.price}</p>
                                        </div>
                                        <AnimatedButton
                                            href="/reserva"
                                            variant="white"
                                            className="!px-4 !py-2 md:!px-6 md:!py-3 !text-xs md:!text-sm"
                                            state={{
                                                selectedService: (() => {
                                                    const serviceMap = {
                                                        'Exterior Detailing': { id: 'exterior', name: translatedService.name, price: 120000, description: translatedService.description, features: translatedService.features },
                                                        'Interior Detailing': { id: 'interior', name: translatedService.name, price: 150000, description: translatedService.description, features: translatedService.features },
                                                        'Engine Bay Cleaning': { id: 'engine', name: translatedService.name, price: 60000, description: translatedService.description, features: translatedService.features },
                                                        'Paint Correction': { id: 'correction', name: translatedService.name, price: 350000, description: translatedService.description, features: translatedService.features },
                                                        'Wheel & Tire Detailing': { id: 'wheels', name: translatedService.name, price: 80000, description: translatedService.description, features: translatedService.features },
                                                        'Premium Car Wash': { id: 'wash', name: translatedService.name, price: 50000, description: translatedService.description, features: translatedService.features }
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
                <ProcessSteps />
            </div>
        </div>
    );
};

export default FlavorSlider;
