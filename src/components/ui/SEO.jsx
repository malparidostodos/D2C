import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords, image, url }) => {
    const { t } = useTranslation();

    const siteTitle = "NUVEN - Detailing Premium";
    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || t('seo.default_description', "Servicios de detailing automotriz premium. Limpieza profunda, corrección de pintura y protección cerámica.");
    const metaKeywords = keywords || t('seo.default_keywords', "detailing, lavado de autos, limpieza automotriz, corrección de pintura, cerámica");
    const metaImage = image || "https://tatoclean.com/og-image.jpg"; // Replace with actual default OG image URL
    const metaUrl = url || window.location.href;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />
        </Helmet>
    );
};

export default SEO;
