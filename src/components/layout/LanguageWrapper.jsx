import React, { useEffect } from 'react';
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageWrapper = ({ language }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (language && ['es', 'en'].includes(language)) {
            if (i18n.language !== language) {
                i18n.changeLanguage(language);
            }
        }
    }, [language, i18n]);

    // If the language param is invalid (not es or en), we might want to redirect or just let it be.
    // For now, the routing in App.jsx will control what matches.

    return <Outlet />;
};

export default LanguageWrapper;
