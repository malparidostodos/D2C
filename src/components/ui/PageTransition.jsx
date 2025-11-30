import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [status, setStatus] = useState('idle'); // 'idle', 'covering', 'revealing'
    const prevPath = useRef(location.pathname);
    const childrenRef = useRef(children);
    const { lenis } = useSmoothScroll();

    // Helper to check if a path is part of the dashboard
    const isDashboardPath = (path) => {
        // Normalize path to remove language prefix if present
        const normalizedPath = path.replace(/^\/(en|es)/, '') || '/';
        return ['/dashboard', '/profile', '/admin'].some(p => normalizedPath.startsWith(p));
    };

    // Keep ref updated with latest children
    useEffect(() => {
        childrenRef.current = children;
    }, [children]);

    useEffect(() => {
        if (location.pathname !== prevPath.current) {
            const isPrevDashboard = isDashboardPath(prevPath.current);
            const isNextDashboard = isDashboardPath(location.pathname);

            // If navigating BETWEEN dashboard pages, skip the curtain
            if (isPrevDashboard && isNextDashboard) {
                // Immediate switch without animation
                window.scrollTo(0, 0);
                if (lenis) {
                    lenis.scrollTo(0, { immediate: true });
                }
                setDisplayChildren(childrenRef.current);
                prevPath.current = location.pathname;
                // Ensure status is idle
                setStatus('idle');
            } else {
                // Normal transition with curtain
                setStatus('covering');
                prevPath.current = location.pathname;
            }
        }
    }, [location.pathname, lenis]);

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
    }, [status, lenis]);

    return (
        <>
            {/* The Page Content */}
            {displayChildren}

            {/* The Curtain */}
            {createPortal(
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
                />,
                document.body
            )}
        </>
    );
};

export default PageTransition;
