import React from 'react';
import { Search, Droplets, Sparkles, ShieldCheck, CheckCircle } from 'lucide-react';

const ProcessTimeline = ({ steps }) => {
    const icons = [Search, Droplets, Sparkles, ShieldCheck, CheckCircle];

    return (
        <div className="relative max-w-5xl mx-auto px-4">
            {/* Vertical Line (Desktop) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden md:block"></div>

            <div className="space-y-12 md:space-y-24">
                {steps.map((step, index) => {
                    const Icon = icons[index] || CheckCircle;
                    const isEven = index % 2 === 0;

                    return (
                        <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 p-4 md:p-8">
                                <div className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ${isEven ? 'md:text-left' : 'md:text-right'} text-center group border border-white/10`}>
                                    <div className={`inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0046b8] text-xs font-bold uppercase tracking-wider mb-4`}>
                                        Paso {index + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0046b8] mb-3">{step.title}</h3>
                                    <p className="text-[#0046b8]/80 font-light leading-relaxed group-hover:text-[#0046b8] transition-colors">{step.description}</p>
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-[#0046b8] z-10 shadow-lg hidden md:flex">
                                <Icon className="w-5 h-5 text-[#0046b8]" />
                            </div>

                            {/* Empty Side (for spacing) */}
                            <div className="w-full md:w-1/2 hidden md:block"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProcessTimeline;
