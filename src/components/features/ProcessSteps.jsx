import { useTranslation } from 'react-i18next';
import { processSteps } from '../../constants';
import { Calendar, User, SprayCan, Star } from 'lucide-react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from 'react';

const ProcessSteps = () => {
    const { t } = useTranslation();
    const containerRef = useRef(null);

    const getIcon = (iconName, colorClass) => {
        const iconColor = colorClass && colorClass.includes('white') ? 'text-[#0046b8]' : 'text-white';
        const className = `w-8 h-8 ${iconColor}`;

        switch (iconName) {
            case 'calendar': return <Calendar className={className} />;
            case 'user': return <User className={className} />;
            case 'spray': return <SprayCan className={className} />;
            case 'star': return <Star className={className} />;
            default: return <Star className={className} />;
        }
    };

    useGSAP(() => {
        const steps = gsap.utils.toArray('.process-step');

        gsap.from(steps, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "left center+=200", // Trigger when container enters horizontally
                containerAnimation: gsap.getById("flavorScroll"), // Link to horizontal scroll if possible, or use standard trigger if vertical
                toggleActions: "play none none reverse"
            }
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="flex-none w-[100vw] lg:w-[80vw] h-full flex flex-col justify-center items-center px-4 lg:px-20 snap-center">
            <div className="text-center mb-16">
                <h3 className="text-yellow-500 font-semibold uppercase tracking-widest mb-4 text-sm md:text-base">
                    {t('flavor_slider.process.title')}
                </h3>
                <h2 className="text-3xl md:text-5xl font-semibold text-[#0046b8] max-w-4xl leading-tight">
                    {t('flavor_slider.process.subtitle')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                {processSteps.map((step, index) => (
                    <div key={step.id} className="process-step flex flex-col items-center text-center group">
                        <div className="relative mb-8">
                            {/* Main Circle */}
                            <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:scale-110`}>
                                {getIcon(step.icon, step.color)}
                            </div>

                            {/* Number Badge */}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">0{index + 1}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-[#0046b8] mb-4">
                            {t(`flavor_slider.process.steps.${step.id}.title`)}
                        </h3>
                        <p className="text-[#0046b8] text-sm leading-relaxed max-w-xs">
                            {t(`flavor_slider.process.steps.${step.id}.description`)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcessSteps;
