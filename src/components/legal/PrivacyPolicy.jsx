import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from './LegalLayout';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    const sections = [
        { id: 'introduction', label: 'legal.privacy.intro_title' },
        { id: 'information-collection', label: 'legal.privacy.collection_title' },
        { id: 'personal-info', label: 'legal.privacy.collection_personal_subtitle' },
        { id: 'vehicle-info', label: 'legal.privacy.collection_vehicle_subtitle' },
        { id: 'technical-info', label: 'legal.privacy.collection_technical_subtitle' },
        { id: 'how-we-use', label: 'legal.privacy.use_title' },
        { id: 'data-storage', label: 'legal.privacy.storage_title' },
        { id: 'data-sharing', label: 'legal.privacy.sharing_title' },
        { id: 'user-rights', label: 'legal.privacy.rights_title' },
        { id: 'cookies', label: 'legal.privacy.cookies_title' },
        { id: 'security', label: 'legal.privacy.security_title' },
        { id: 'minors', label: 'legal.privacy.minors_title' },
        { id: 'updates', label: 'legal.privacy.updates_title' },
        { id: 'contact', label: 'legal.privacy.contact_title' }
    ];

    return (
        <LegalLayout
            title={t('legal.privacy_policy')}
            subtitle={t('legal.privacy.subtitle')}
            sections={sections}
        >
            <div className="space-y-8">

                {/* Introduction */}
                <section id="introduction">
                    <h2>{t('legal.privacy.intro_title')}</h2>
                    <p>{t('legal.privacy.intro_text')}</p>
                </section>

                {/* Information Collection */}
                <section id="information-collection">
                    <h2>{t('legal.privacy.collection_title')}</h2>
                    <p>{t('legal.privacy.collection_text')}</p>

                    <h3 id="personal-info">{t('legal.privacy.collection_personal_subtitle')}</h3>
                    <p>{t('legal.privacy.collection_personal_text')}</p>

                    <h3 id="vehicle-info">{t('legal.privacy.collection_vehicle_subtitle')}</h3>
                    <p>{t('legal.privacy.collection_vehicle_text')}</p>

                    <h3 id="technical-info">{t('legal.privacy.collection_technical_subtitle')}</h3>
                    <p>{t('legal.privacy.collection_technical_text')}</p>
                </section>

                {/* How We Use Information */}
                <section id="how-we-use">
                    <h2>{t('legal.privacy.use_title')}</h2>
                    <p>{t('legal.privacy.use_text')}</p>
                </section>

                {/* Data Storage and Retention */}
                <section id="data-storage">
                    <h2>{t('legal.privacy.storage_title')}</h2>
                    <p>{t('legal.privacy.storage_text')}</p>
                </section>

                {/* Data Sharing */}
                <section id="data-sharing">
                    <h2>{t('legal.privacy.sharing_title')}</h2>
                    <p>{t('legal.privacy.sharing_text')}</p>
                </section>

                {/* User Rights */}
                <section id="user-rights">
                    <h2>{t('legal.privacy.rights_title')}</h2>
                    <p>{t('legal.privacy.rights_text')}</p>
                </section>

                {/* Cookies and Tracking */}
                <section id="cookies">
                    <h2>{t('legal.privacy.cookies_title')}</h2>
                    <p>{t('legal.privacy.cookies_text')}</p>
                </section>

                {/* Security Measures */}
                <section id="security">
                    <h2>{t('legal.privacy.security_title')}</h2>
                    <p>{t('legal.privacy.security_text')}</p>
                </section>

                {/* Children and Minors */}
                <section id="minors">
                    <h2>{t('legal.privacy.minors_title')}</h2>
                    <p>{t('legal.privacy.minors_text')}</p>
                </section>

                {/* Updates to Policy */}
                <section id="updates">
                    <h2>{t('legal.privacy.updates_title')}</h2>
                    <p>{t('legal.privacy.updates_text')}</p>
                </section>

                {/* Contact Information */}
                <section id="contact">
                    <h2>{t('legal.privacy.contact_title')}</h2>
                    <p>{t('legal.privacy.contact_text')}</p>
                </section>

            </div>
        </LegalLayout>
    );
};

export default PrivacyPolicy;
