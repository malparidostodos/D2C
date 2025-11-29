import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [status, setStatus] = useState('idle'); // 'idle', 'covering', 'revealing'
    const prevPath = useRef(location.pathname);
    const childrenRef = useRef(children);
    const { lenis } = useSmoothScroll();

    // Keep ref updated with latest children
    useEffect(() => {
        childrenRef.current = children;
    }, [children]);

    useEffect(() => {
        if (location.pathname !== prevPath.current) {
            // Path changed, start transition
            setStatus('covering');
            prevPath.current = location.pathname;
        }
    }, [location.pathname]);

    useEffect(() => {
        if (status === 'covering') {
            // Wait for cover animation to finish (600ms match CSS)
            const timer = setTimeout(() => {
                // Scroll to top while covered
                window.scrollTo(0, 0);
                if (lenis) {
                    lenis.scrollTo(0, { immediate: true });
                }

                // Switch content to the NEW children (from ref)
                setDisplayChildren(childrenRef.current);
                // Start reveal
                setStatus('revealing');
            }, 600);
            return () => clearTimeout(timer);
        }

        if (status === 'revealing') {
            // Wait for reveal animation to finish
            const timer = setTimeout(() => {
                setStatus('idle');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <>
            {/* The Page Content */}
            {displayChildren}

            {/* The Curtain */}
            <div
                className="fixed inset-0 z-[9999] pointer-events-none bg-[#0046b8]"
                style={{
                    transform: status === 'idle'
                        ? 'translateY(100%)' // Hidden at bottom
                        : status === 'covering'
                            ? 'translateY(0%)' // Covering screen
                            : 'translateY(-100%)', // Sliding away to top
                    transition: status === 'idle'
                        ? 'none' // Instant reset when idle
                        : 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />
        </>
    );
};

export default PageTransition;
