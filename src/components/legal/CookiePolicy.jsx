import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from './LegalLayout';

const CookiePolicy = () => {
    const { t } = useTranslation();

    const sections = [
        { id: 'introduction', label: 'legal.cookie.intro_title' },
        { id: 'important-information', label: 'legal.cookie.important_title' },
        { id: 'purpose', label: 'legal.cookie.important_purpose_subtitle' },
        { id: 'controller', label: 'legal.cookie.important_controller_subtitle' },
        { id: 'what-are-cookies', label: 'legal.cookie.what_are_title' },
        { id: 'types-of-cookies', label: 'legal.cookie.types_title' },
        { id: 'necessary-cookies', label: 'legal.cookie.types_necessary_subtitle' },
        { id: 'functional-cookies', label: 'legal.cookie.types_functional_subtitle' },
        { id: 'analytical-cookies', label: 'legal.cookie.types_analytical_subtitle' },
        { id: 'marketing-cookies', label: 'legal.cookie.types_marketing_subtitle' },
        { id: 'information-collected', label: 'legal.cookie.info_collected_title' },
        { id: 'managing-cookies', label: 'legal.cookie.managing_title' },
        { id: 'updates', label: 'legal.cookie.updates_title' }
    ];

    return (
        <LegalLayout
            title={t('legal.cookie_policy')}
            subtitle={t('legal.cookie.subtitle')}
            sections={sections}
        >
            <div className="space-y-8">

                {/* Introduction */}
                <section id="introduction">
                    <h2>{t('legal.cookie.intro_title')}</h2>
                    <p>{t('legal.cookie.intro_text')}</p>
                </section>

                {/* Important Information */}
                <section id="important-information">
                    <h2>{t('legal.cookie.important_title')}</h2>

                    <h3 id="purpose">{t('legal.cookie.important_purpose_subtitle')}</h3>
                    <p>{t('legal.cookie.important_purpose_text')}</p>

                    <h3 id="controller">{t('legal.cookie.important_controller_subtitle')}</h3>
                    <p>{t('legal.cookie.important_controller_text')}</p>
                </section>

                {/* What Are Cookies */}
                <section id="what-are-cookies">
                    <h2>{t('legal.cookie.what_are_title')}</h2>
                    <p>{t('legal.cookie.what_are_text')}</p>
                </section>

                {/* Types of Cookies */}
                <section id="types-of-cookies">
                    <h2>{t('legal.cookie.types_title')}</h2>

                    <h3 id="necessary-cookies">{t('legal.cookie.types_necessary_subtitle')}</h3>
                    <p>{t('legal.cookie.types_necessary_text')}</p>

                    <h3 id="functional-cookies">{t('legal.cookie.types_functional_subtitle')}</h3>
                    <p>{t('legal.cookie.types_functional_text')}</p>

                    <h3 id="analytical-cookies">{t('legal.cookie.types_analytical_subtitle')}</h3>
                    <p>{t('legal.cookie.types_analytical_text')}</p>

                    <h3 id="marketing-cookies">{t('legal.cookie.types_marketing_subtitle')}</h3>
                    <p>{t('legal.cookie.types_marketing_text')}</p>
                </section>

                {/* Information Collected Through Cookies */}
                <section id="information-collected">
                    <h2>{t('legal.cookie.info_collected_title')}</h2>
                    <p>{t('legal.cookie.info_collected_text')}</p>
                </section>

                {/* Managing Cookies */}
                <section id="managing-cookies">
                    <h2>{t('legal.cookie.managing_title')}</h2>
                    <p>{t('legal.cookie.managing_text')}</p>
                </section>

                {/* Updates to This Cookie Policy */}
                <section id="updates">
                    <h2>{t('legal.cookie.updates_title')}</h2>
                    <p>{t('legal.cookie.updates_text')}</p>
                </section>

            </div>
        </LegalLayout>
    );
};

export default CookiePolicy;
