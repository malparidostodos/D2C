import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useMenu } from '../../hooks/useMenu.jsx';

const CookieConsent = () => {
    const { t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const { hidden, isMenuMounted } = useMenu();

    useEffect(() => {
        // Don't show on cookie policy page
        if (location.pathname.includes('cookie-policy')) {
            setIsVisible(false);
            return;
        }

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Small delay to show after page load
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`fixed right-4 z-50 max-w-[400px] w-[calc(100%-2rem)] transition-all duration-300 ${isMenuMounted && hidden ? 'bottom-4' : (isMenuMounted ? 'bottom-24 md:bottom-4' : 'bottom-4')}`}
                >
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex gap-4 relative z-10">
                            <div className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex">
                                <Cookie className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                                    {t('legal.cookie_policy')}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                    {t('cookie_consent.message')}
                                    <Link
                                        to={i18n.language === 'en' ? '/en/cookie-policy' : '/cookie-policy'}
                                        className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    >
                                        {t('cookie_consent.learn_more')}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-3 relative z-10">
                            <button
                                onClick={handleDecline}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
                            >
                                {t('cookie_consent.decline')}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                {t('cookie_consent.accept')}
                            </button>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
