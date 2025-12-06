import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const { lenis } = useSmoothScroll();

    useEffect(() => {
        if (lenis) {
            // Immediate scroll to top without animation to simulate a fresh page load
            lenis.scrollTo(0, { immediate: true });
        } else {
            // Fallback for when lenis is not yet available or disabled
            window.scrollTo(0, 0);
        }
    }, [pathname, lenis]);

    return null;
};

export default ScrollToTop;
