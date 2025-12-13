import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
    es: {
        translation: translationES,
    },
    en: {
        translation: translationEN,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        debug: true, // Set to false in production
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        detection: {
            order: ['path', 'localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            caches: ['localStorage'],
            // Custom path detection to handle default Spanish route
            lookupFromSubdomainIndex: 0,
        },
    });

export default i18n;
