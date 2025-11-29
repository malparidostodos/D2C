import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageTransition from '../ui/PageTransition';

import CookieConsent from '../ui/CookieConsent';

const LanguageWrapper = ({ language }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const outlet = useOutlet();

    useEffect(() => {
        if (language && ['es', 'en'].includes(language)) {
            if (i18n.language !== language) {
                i18n.changeLanguage(language);
            }
        }
    }, [language, i18n]);

    // If the language param is invalid (not es or en), we might want to redirect or just let it be.
    // For now, the routing in App.jsx will control what matches.

    return (
        <>
            <PageTransition>{outlet}</PageTransition>
            <CookieConsent />
        </>
    );
};

export default LanguageWrapper;
