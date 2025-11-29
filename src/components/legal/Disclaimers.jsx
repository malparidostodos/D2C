import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from './LegalLayout';

const Disclaimers = () => {
    const { t } = useTranslation();

    const sections = [
        { id: 'service-results', label: 'legal.disclaimers.service_title' },
        { id: 'vehicle-condition', label: 'legal.disclaimers.vehicle_title' },
        { id: 'external-links', label: 'legal.disclaimers.links_title' },
        { id: 'professional-advice', label: 'legal.disclaimers.advice_title' }
    ];

    return (
        <LegalLayout
            title={t('legal.disclaimers.title')}
            subtitle={t('legal.disclaimers.subtitle')}
            sections={sections}
        >
            <div className="space-y-8">

                {/* Service Results Disclaimer */}
                <section id="service-results">
                    <h2>{t('legal.disclaimers.service_title')}</h2>
                    <p>{t('legal.disclaimers.service_text')}</p>
                </section>

                {/* Vehicle Condition Disclaimer */}
                <section id="vehicle-condition">
                    <h2>{t('legal.disclaimers.vehicle_title')}</h2>
                    <p>{t('legal.disclaimers.vehicle_text')}</p>
                </section>

                {/* External Links Disclaimer */}
                <section id="external-links">
                    <h2>{t('legal.disclaimers.links_title')}</h2>
                    <p>{t('legal.disclaimers.links_text')}</p>
                </section>

                {/* Professional Advice Disclaimer */}
                <section id="professional-advice">
                    <h2>{t('legal.disclaimers.advice_title')}</h2>
                    <p>{t('legal.disclaimers.advice_text')}</p>
                </section>

            </div>
        </LegalLayout>
    );
};

export default Disclaimers;
