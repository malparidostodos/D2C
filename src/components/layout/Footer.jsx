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
                scrub: 1,
                id: "footer-animation" // Add ID to identify this trigger
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
            // Only kill the footer-specific ScrollTrigger
            ScrollTrigger.getAll().forEach(t => {
                if (t.vars.id === "footer-animation") {
                    t.kill()
                }
            })
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

                <div className="flex justify-between items-center w-full z-30 mt-auto md:mt-[4vh] mb-8 md:mb-20 md:border-t md:border-solid border-none border-[#0046b8]/10 pt-8 relative">
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
                    <div className="flex items-end gap-1 md:gap-8 w-full max-w-full md:max-w-[90%] h-auto text-[#0046b8] opacity-100">
                        {/* N */}
                        <svg viewBox="0 0 85 103" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto self-end">
                            <path d="M84.508 103.008H67.636L16.872 26.196V103.008H-5.66244e-06V5.00679e-06H16.872L67.636 76.664V5.00679e-06H84.508V103.008Z" fill="currentColor" />
                        </svg>
                        {/* U */}
                        <svg viewBox="0 0 75 83" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[95%] w-auto self-end">
                            <path d="M74.592 4.29153e-06V81.548H57.72V71.928C55.056 75.2827 51.5533 77.9467 47.212 79.92C42.9693 81.7947 38.4307 82.732 33.596 82.732C27.1827 82.732 21.4107 81.4 16.28 78.736C11.248 76.072 7.252 72.1253 4.292 66.896C1.43067 61.6667 -5.66244e-07 55.352 -5.66244e-07 47.952V4.29153e-06H16.724V45.436C16.724 52.7373 18.5493 58.3613 22.2 62.308C25.8507 66.156 30.8333 68.08 37.148 68.08C43.4627 68.08 48.4453 66.156 52.096 62.308C55.8453 58.3613 57.72 52.7373 57.72 45.436V4.29153e-06H74.592Z" fill="currentColor" />
                        </svg>
                        {/* V */}
                        <svg viewBox="0 0 83 82" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[95%] w-auto self-end">
                            <path d="M41.144 66.452L64.232 -3.33786e-06H82.14L51.06 81.548H30.932L5.62519e-07 -3.33786e-06H18.056L41.144 66.452Z" fill="currentColor" />
                        </svg>
                        {/* E */}
                        <svg viewBox="0 0 81 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[95%] w-auto self-end">
                            <path d="M80.364 40.108C80.364 43.1667 80.1667 45.9293 79.772 48.396H17.464C17.9573 54.908 20.3747 60.1373 24.716 64.084C29.0573 68.0307 34.3853 70.004 40.7 70.004C49.7773 70.004 56.1907 66.2053 59.94 58.608H78.144C75.6773 66.1067 71.188 72.2733 64.676 77.108C58.2627 81.844 50.2707 84.212 40.7 84.212C32.9053 84.212 25.9 82.4853 19.684 79.032C13.5667 75.48 8.732 70.5467 5.18 64.232C1.72667 57.8187 2.14577e-06 50.4187 2.14577e-06 42.032C2.14577e-06 33.6453 1.67734 26.2947 5.032 19.98C8.48534 13.5667 13.2707 8.63333 19.388 5.17999C25.604 1.72666 32.708 -3.09944e-06 40.7 -3.09944e-06C48.396 -3.09944e-06 55.2533 1.67733 61.272 5.03199C67.2907 8.38666 71.9773 13.1227 75.332 19.24C78.6867 25.2587 80.364 32.2147 80.364 40.108ZM62.752 34.78C62.6533 28.564 60.4333 23.5813 56.092 19.832C51.7507 16.0827 46.3733 14.208 39.96 14.208C34.1387 14.208 29.156 16.0827 25.012 19.832C20.868 23.4827 18.4013 28.4653 17.612 34.78H62.752Z" fill="currentColor" />
                        </svg>
                        {/* N */}
                        <svg viewBox="0 0 75 83" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[95%] w-auto self-end">
                            <path d="M41.144 -3.09944e-06C47.5573 -3.09944e-06 53.28 1.33199 58.312 3.99599C63.4427 6.65999 67.4387 10.6067 70.3 15.836C73.1613 21.0653 74.592 27.38 74.592 34.78V82.88H57.868V37.296C57.868 29.9947 56.0427 24.42 52.392 20.572C48.7413 16.6253 43.7587 14.652 37.444 14.652C31.1293 14.652 26.0973 16.6253 22.348 20.572C18.6973 24.42 16.872 29.9947 16.872 37.296V82.88H-5.66244e-06V1.332H16.872V10.656C19.6347 7.30133 23.1373 4.68666 27.38 2.812C31.7213 0.93733 36.3093 -3.09944e-06 41.144 -3.09944e-06Z" fill="currentColor" />
                        </svg>
                    </div>
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