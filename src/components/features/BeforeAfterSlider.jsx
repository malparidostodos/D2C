import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

const BeforeAfterSlider = ({ beforeImage, afterImage, title, description }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (event) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;

        let position = ((clientX - containerRect.left) / containerRect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        setSliderPosition(position);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{title}</h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">{description}</p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-white/10 bg-[#111]"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* After Image (Background) */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
                    <img
                        src={afterImage}
                        alt="After"
                        className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_30px_rgba(0,70,184,0.3)]"
                        draggable="false"
                    />
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20 z-20">
                    AFTER
                </div>

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden bg-[#1a1a1a] border-r border-white/20"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#111]">
                        <img
                            src={beforeImage}
                            alt="Before"
                            className="w-[80%] h-[80%] object-contain filter grayscale sepia-[0.4] brightness-[0.6] opacity-80"
                            draggable="false"
                        />
                    </div>
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20 z-20">
                        BEFORE
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0046b8]">
                        <MoveHorizontal className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="text-center mt-4 text-white/50 text-sm">
                Desliza para ver la transformación
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
