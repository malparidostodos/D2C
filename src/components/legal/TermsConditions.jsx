import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from './LegalLayout';

const TermsConditions = () => {
    const { t } = useTranslation();

    const sections = [
        { id: 'introduction', label: 'legal.terms.intro_title' },
        { id: 'services', label: 'legal.terms.services_title' },
        { id: 'booking', label: 'legal.terms.booking_title' },
        { id: 'booking-process', label: 'legal.terms.booking_process_subtitle' },
        { id: 'booking-payment', label: 'legal.terms.booking_payment_subtitle' },
        { id: 'user-accounts', label: 'legal.terms.accounts_title' },
        { id: 'liability', label: 'legal.terms.liability_title' },
        { id: 'cancellation', label: 'legal.terms.cancellation_title' },
        { id: 'intellectual-property', label: 'legal.terms.ip_title' },
        { id: 'changes', label: 'legal.terms.changes_title' }
    ];

    return (
        <LegalLayout
            title={t('legal.terms_conditions')}
            subtitle={t('legal.terms.subtitle')}
            sections={sections}
        >
            <div className="space-y-8">

                {/* Introduction */}
                <section id="introduction">
                    <h2>{t('legal.terms.intro_title')}</h2>
                    <p>{t('legal.terms.intro_text')}</p>
                </section>

                {/* Services */}
                <section id="services">
                    <h2>{t('legal.terms.services_title')}</h2>
                    <p>{t('legal.terms.services_text')}</p>
                </section>

                {/* Booking and Payment */}
                <section id="booking">
                    <h2>{t('legal.terms.booking_title')}</h2>
                    <p>{t('legal.terms.booking_text')}</p>

                    <h3 id="booking-process">{t('legal.terms.booking_process_subtitle')}</h3>
                    <p>{t('legal.terms.booking_process_text')}</p>

                    <h3 id="booking-payment">{t('legal.terms.booking_payment_subtitle')}</h3>
                    <p>{t('legal.terms.booking_payment_text')}</p>
                </section>

                {/* User Accounts */}
                <section id="user-accounts">
                    <h2>{t('legal.terms.accounts_title')}</h2>
                    <p>{t('legal.terms.accounts_text')}</p>
                </section>

                {/* Limitation of Liability */}
                <section id="liability">
                    <h2>{t('legal.terms.liability_title')}</h2>
                    <p>{t('legal.terms.liability_text')}</p>
                </section>

                {/* Cancellation Policy */}
                <section id="cancellation">
                    <h2>{t('legal.terms.cancellation_title')}</h2>
                    <p>{t('legal.terms.cancellation_text')}</p>
                </section>

                {/* Intellectual Property */}
                <section id="intellectual-property">
                    <h2>{t('legal.terms.ip_title')}</h2>
                    <p>{t('legal.terms.ip_text')}</p>
                </section>

                {/* Changes to Terms */}
                <section id="changes">
                    <h2>{t('legal.terms.changes_title')}</h2>
                    <p>{t('legal.terms.changes_text')}</p>
                </section>

            </div>
        </LegalLayout>
    );
};

export default TermsConditions;
