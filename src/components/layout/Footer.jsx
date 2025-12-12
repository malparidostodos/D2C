import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'
import { useSmoothScroll } from '../ui/SmoothScroll'
import Logo from '../ui/Logo'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const { t, i18n } = useTranslation()
    const { getLocalizedPath, navigateWithTransition } = useMenu()
    const { lenis } = useSmoothScroll()
    const containerRef = useRef(null)
    const heroRef = useRef(null)
    const headerHtmlRef = useRef(null)
    const scrollTopRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const hero = heroRef.current
        const headerHtml = headerHtmlRef.current

        if (!container || !hero || !headerHtml) return



        // Initial States
        // Content should be static, so we ONLY set initial state for the text chars
        gsap.set(hero, {
            clipPath: "none",
            transform: "none",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%"
        })

        // Text Chars initial
        const chars = headerHtml.querySelectorAll("svg")
        const isMobile = window.innerWidth < 768
        gsap.set(chars, {
            yPercent: isMobile ? 400 : 300,
            autoAlpha: 0
        })

        // Scroll Top Button initial
        if (scrollTopRef.current) {
            gsap.set(scrollTopRef.current, { yPercent: 200, autoAlpha: 0 })
        }

        // Animation Timeline triggered on scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: isMobile ? "top 75%" : "top 90%",
                end: "bottom bottom",
                scrub: 1
            }
        })

        // On scroll, only animate the text characters
        tl.to(chars, {
            yPercent: 0,
            autoAlpha: 1,
            stagger: isMobile ? 0.3 : 0.1,
            duration: 1.5,
            ease: "power1.out"
        })

        if (scrollTopRef.current) {
            tl.to(scrollTopRef.current, {
                yPercent: 0,
                autoAlpha: 1,
                ease: "none",
                duration: 0.5
            }, ">-0.5") // Start slightly before the text finishes, or towards the end
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    const footerLinkClass = "relative w-fit block after:block after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left"
    const headerClass = "mb-4 opacity-40 text-xs md:text-sm tracking-wider"

    return (
        <footer ref={containerRef} className="relative w-full h-auto md:h-[130vh] overflow-hidden bg-white text-[#0046b8] font-sans select-none">

            {/* Main Content Wrapper */}
            <div ref={heroRef} className="relative md:absolute w-full h-auto md:h-full z-10 will-change-transform bg-white flex flex-col justify-between pt-12 pb-6 px-8 md:px-12">

                {/* Top Grid: Links */}
                {/* Top Grid: Links */}
                <div className="flex flex-col md:grid md:grid-cols-5 gap-0 md:gap-4 z-30 w-full relative mb-12">

                    <FooterColumn title={t('footer.start_now')} className="border-t border-[#0046b8]/10 md:border-none">
                        <a href={getLocalizedPath("/login")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath("/login")); }} className={footerLinkClass}>{t('header.login')}</a>
                        <a href={getLocalizedPath("/signup")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath("/signup")); }} className={footerLinkClass}>{t('header.signup')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/booking" : "/reserva")); }} className={footerLinkClass}>{t('button.book_now')}</a>
                    </FooterColumn>

                    <FooterColumn title={t('footer.explore')} className="border-t border-[#0046b8]/10 md:border-none">
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/services" : "/servicios")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/services" : "/servicios")); }} className={footerLinkClass}>{t('header.services')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/roadmap" : "/proceso")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/roadmap" : "/proceso")); }} className={footerLinkClass}>{t('header.process')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/memberships" : "/membresias")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/memberships" : "/membresias")); }} className={footerLinkClass}>{t('header.memberships')}</a>
                    </FooterColumn>

                    <FooterColumn title={t('footer.company')} className="border-t border-[#0046b8]/10 md:border-none">
                        <div className="text-sm select-text">
                            <div>{t('contact_section.address.line1')}</div>
                            <div>{t('contact_section.address.line2')}</div>
                            <div>{t('contact_section.address.country')}</div>
                        </div>
                        <a href="mailto:business@nuven.com" className={`${footerLinkClass} mt-2`}>business@nuven.com</a>
                        <a href="mailto:contacto@nuven.com" className={footerLinkClass}>contacto@nuven.com</a>
                    </FooterColumn>

                    <FooterColumn title={t('footer.legal')} className="border-t border-[#0046b8]/10 md:border-none">
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/privacy-policy" : "/politica-de-privacidad")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/privacy-policy" : "/politica-de-privacidad")); }} className={footerLinkClass}>{t('legal.privacy_policy')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/terms-conditions" : "/terminos-y-condiciones")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/terms-conditions" : "/terminos-y-condiciones")); }} className={footerLinkClass}>{t('legal.terms_conditions')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/cookie-policy" : "/politica-de-cookies")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/cookie-policy" : "/politica-de-cookies")); }} className={footerLinkClass}>{t('legal.cookie_policy')}</a>
                        <a href={getLocalizedPath(i18n.language === 'en' ? "/disclaimers" : "/descargos")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath(i18n.language === 'en' ? "/disclaimers" : "/descargos")); }} className={footerLinkClass}>{t('legal.disclaimers.title')}</a>
                    </FooterColumn>

                    <FooterColumn title={t('footer.help')} className="border-t border-b border-[#0046b8]/10 md:border-none">
                        <a href={getLocalizedPath("/faq")} onClick={(e) => { e.preventDefault(); navigateWithTransition(getLocalizedPath("/faq")); }} className={footerLinkClass}>{t('contact_section.footer.help.faq')}</a>
                    </FooterColumn>
                </div>

                <div className="flex justify-between items-center w-full z-30 mb-8 md:mb-20 md:border-t md:border-solid border-none border-[#0046b8]/10 pt-8 relative">
                    {/* Mobile-only full-width divider */}
                    <div className="absolute top-0 -left-8 w-[calc(100%+4rem)] h-[1px] bg-[#0046b8]/10 md:hidden" />

                    <div className="flex gap-4">
                        {/* Placeholder for App Badges if needed, currently empty or reused content */}
                        <div className="flex gap-2">
                            {/* Optional: Add badges here later */}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="group flex items-center gap-2 relative overflow-visible w-fit">
                            <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                                <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </span>
                            <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Twitter / X</span>
                        </a>
                        <a href="#" className="group flex items-center gap-2 relative overflow-visible w-fit">
                            <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                                <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </span>
                            <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Instagram</span>
                        </a>
                        <a href="#" className="group flex items-center gap-2 relative overflow-visible w-fit">
                            <span className="w-0 h-[20px] opacity-0 -translate-x-[10px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shrink-0 flex items-center justify-center group-hover:w-[20px] group-hover:opacity-100 group-hover:translate-x-0">
                                <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.948 18.113a.75.75 0 0 1-1.06-1.06l9.885-9.886H8.65a.75.75 0 1 1 0-1.5h9.682v9.682a.75.75 0 0 1-1.5 0v-7.12l-9.884 9.884Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </span>
                            <span className="transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[5px]">Linkedin</span>
                        </a>
                    </div>
                </div>

                {/* Big Header Text (Centered Background) */}
                <div ref={headerHtmlRef} className="relative md:absolute md:top-[60%] md:left-0 w-full z-0 pointer-events-none md:-translate-y-1/2 flex justify-center px-2 md:px-4 mt-24 mb-28 md:my-0">
                    <Logo className="w-full max-w-full md:max-w-[90%] h-auto text-[#0046b8] opacity-100 gap-1 md:gap-8" />
                </div>

                {/* Footer Bottom Bar (Language & Copyright) */}
                <div className="relative z-30 flex justify-between items-end text-xs md:text-sm text-[#0046b8] font-medium mt-auto">
                    <div className="flex gap-2">
                        {/* Language Selector Placeholder if needed, or just copyright */}
                        <span>&copy; {new Date().getFullYear()}</span>
                    </div>

                    <div className="flex gap-6 uppercase tracking-widest">
                        {/* Made by text removed as per request */}
                    </div>
                </div>

                {/* Scroll to Top Button */}
                <button
                    ref={scrollTopRef}
                    onClick={() => {
                        if (lenis) {
                            lenis.scrollTo(0, { duration: 2.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                    }}
                    className="absolute bottom-6 right-6 w-[3.5em] h-[3.5em] bg-[#0046b8] rounded-full flex items-center justify-center overflow-hidden group text-white z-40 opacity-0" // Add opacity-0 to prevent flash before GSAP init
                    aria-label={t('contact_section.footer.bottom.aria_label_scroll')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="transition-transform duration-400 ease-[cubic-bezier(0.35,0,0,1)] group-hover:-translate-y-[3em]">
                        <path fill="currentColor" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="absolute translate-y-[3em] transition-transform duration-400 ease-[cubic-bezier(0.35,0,0,1)] group-hover:translate-y-0">
                        <path fill="currentColor" fillRule="evenodd" d="M12 22a1 1 0 0 1-1-1V5.857l-6.223 6.224a1 1 0 0 1-1.415-1.415l7.9-7.9a1 1 0 0 1 1.414 0v.001l7.9 7.9a1 1 0 0 1-1.414 1.414L13 5.919V21a1 1 0 0 1-1 1Z" clipRule="evenodd" />
                    </svg>
                </button>

            </div>
        </footer>
    )
}

const FooterColumn = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className={`flex flex-col ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between py-4 text-base md:text-sm tracking-wider transition-opacity text-left md:normal-case ${isOpen ? 'opacity-40' : 'opacity-100'} md:opacity-40 md:hover:opacity-40 md:cursor-auto md:pointer-events-none md:block md:py-0 md:mb-4`}
            >
                {title}
                {/* Plus Icon - visible only on mobile */}
                <span className="md:hidden relative w-3 h-3 flex items-center justify-center">
                    <span className="absolute w-full h-[1px] bg-current transition-transform duration-300 ease-out" />
                    <span className={`absolute w-full h-[1px] bg-current transition-transform duration-300 ease-out ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                </span>
            </button>
            <div className={`flex flex-col gap-2 px-3 md:px-0 overflow-hidden transition-all duration-300 ease-in-out md:h-auto md:opacity-100 md:visible md:max-h-none md:overflow-visible ${isOpen ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 md:mb-0'}`}>
                {children}
            </div>
        </div>
    )
}

export default Footer