import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dashboardTheme');
            // Check if user has a system preference if no saved preference? 
            // For now, consistent with previous BookingPage logic, default to false (light) if not set.
            return saved !== null ? JSON.parse(saved) : false;
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('dashboardTheme', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return { isDarkMode, toggleTheme, setIsDarkMode };
};
