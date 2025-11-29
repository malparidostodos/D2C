import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageSelector = ({ className = "" }) => {
    const { i18n } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'ES';

    const languages = [
        { code: 'ES', label: 'Español' },
        { code: 'EN', label: 'English' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangOpen(false);
            }
        };

        if (langOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [langOpen]);

    const handleLanguageChange = (langCode) => {
        const targetLang = langCode.toLowerCase();
        const currentPath = location.pathname;

        if (i18n.language === targetLang) {
            setLangOpen(false);
            return;
        }

        let newPath = currentPath;

        if (targetLang === 'en') {
            if (!currentPath.startsWith('/en')) {
                newPath = `/en${currentPath === '/' ? '' : currentPath}`;
            }
        } else {
            // Switch to ES (remove /en)
            if (currentPath.startsWith('/en')) {
                newPath = currentPath.replace(/^\/en/, '') || '/';
            }
        }

        i18n.changeLanguage(targetLang);

        if (newPath !== currentPath) {
            window.location.href = newPath;
        } else {
            window.location.reload();
        }

        setLangOpen(false);
    };

    return (
        <div ref={langRef} className={`_dropdown _language-select md:flex ${className}`} aria-expanded={langOpen} role="button">
            <button
                className="_dropdown-button w-full flex items-center justify-center gap-2 !bg-white/10 !backdrop-blur-md !border !border-white/50 !text-white hover:!bg-white/30 transition-all duration-300 rounded-full px-4 py-2"
                onClick={() => setLangOpen(!langOpen)}
                type="button"
            >
                <span className="_icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                        <path d="M12 22C17.5228 22 22 17.5229 22 12C22 6.47716 17.5228 2 12 2C6.47715 2 2 6.47716 2 12C2 17.5229 6.47715 22 12 22Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M3 9H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M3 15H21" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M12 2C14.5013 4.73836 15.9228 8.29204 16 12C15.9228 15.708 14.5013 19.2617 12 22C9.49872 19.2617 8.07725 15.708 8 12C8.07725 8.29204 9.49872 4.73836 12 2V2Z" data-mode="stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>
                <span>{currentLang}</span>
                <span className={`_icon chevron ${langOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 13.9393L6.53033 8.46967L5.46967 9.53033L10.409 14.4697C11.2877 15.3483 12.7123 15.3484 13.591 14.4697L18.5303 9.53033L17.4697 8.46967L12 13.9393Z" data-mode="fill" fill="currentColor"></path>
                    </svg>
                </span>
            </button>

            {langOpen && (
                <div className="_language-dropdown-menu">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`_lang-item ${currentLang === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span>{lang.label}</span>
                            {currentLang === lang.code && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
