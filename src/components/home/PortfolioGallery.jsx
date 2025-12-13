import React, { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const PortfolioGallery = () => {
    const { t } = useTranslation()
    const container = useRef(null)
    const progressLineRef = useRef(null)
    const progressLineMobileRef = useRef(null)
    const mobileTextRef = useRef(null)
    const [showFullGallery, setShowFullGallery] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [showMobileText, setShowMobileText] = useState(false)

    // Close modals with Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (selectedImage) {
                    setSelectedImage(null)
                } else if (showFullGallery) {
                    setShowFullGallery(false)
                }
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [selectedImage, showFullGallery])

    // Block body scroll when modals are open
    useEffect(() => {
        if (showFullGallery || selectedImage) {
            // Simple approach: just prevent scrolling
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
            document.documentElement.style.overflow = 'hidden'

            // Dispatch custom event to stop Lenis
            window.dispatchEvent(new CustomEvent('toggleScroll', { detail: { enabled: false } }))
        } else {
            // Restore scrolling
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
            document.documentElement.style.overflow = ''

            // Dispatch custom event to start Lenis
            window.dispatchEvent(new CustomEvent('toggleScroll', { detail: { enabled: true } }))

            // Refresh portfolio and footer ScrollTriggers
            setTimeout(() => {
                ScrollTrigger.getAll().forEach((trigger) => {
                    // Refresh portfolio triggers
                    if (trigger.vars.trigger === '.sticky-portfolio') {
                        trigger.refresh()
                    }
                    // Refresh footer animation trigger
                    if (trigger.vars.id === 'footer-animation') {
                        trigger.refresh()
                    }
                })
            }, 100)
        }

        return () => {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
            document.documentElement.style.overflow = ''
            window.dispatchEvent(new CustomEvent('toggleScroll', { detail: { enabled: true } }))
        }
    }, [showFullGallery, selectedImage])

    // Array de imágenes de trabajos realizados con información
    const portfolioImages = [
        {
            image: "/images/portfolio/work-1.jpeg",
            title: t('portfolio.items.complete_detailing.title'),
            description: t('portfolio.items.complete_detailing.description'),
            services: t('portfolio.items.complete_detailing.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-2.png",
            title: t('portfolio.items.interior_restoration.title'),
            description: t('portfolio.items.interior_restoration.description'),
            services: t('portfolio.items.interior_restoration.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-3.png",
            title: t('portfolio.items.paint_correction.title'),
            description: t('portfolio.items.paint_correction.description'),
            services: t('portfolio.items.paint_correction.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-4.png",
            title: t('portfolio.items.exterior_detailing.title'),
            description: t('portfolio.items.exterior_detailing.description'),
            services: t('portfolio.items.exterior_detailing.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-5.png",
            title: t('portfolio.items.engine_cleaning.title'),
            description: t('portfolio.items.engine_cleaning.description'),
            services: t('portfolio.items.engine_cleaning.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-6.jpg",
            title: t('portfolio.items.wheels_tires.title'),
            description: t('portfolio.items.wheels_tires.description'),
            services: t('portfolio.items.wheels_tires.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-7.jpg",
            title: t('portfolio.items.suv_detailing.title'),
            description: t('portfolio.items.suv_detailing.description'),
            services: t('portfolio.items.suv_detailing.services', { returnObjects: true })
        },
        {
            image: "/images/portfolio/work-8.jpg",
            title: t('portfolio.items.headlight_correction.title'),
            description: t('portfolio.items.headlight_correction.description'),
            services: t('portfolio.items.headlight_correction.services', { returnObjects: true })
        }
    ]

    useGSAP(
        () => {
            if (showFullGallery) return // Don't run sticky animation if gallery is open

            gsap.registerPlugin(ScrollTrigger)

            // Kill all existing ScrollTriggers for this section first
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === '.sticky-portfolio') {
                    trigger.kill()
                }
            })

            const cards = container.current.querySelectorAll('.portfolio-card')
            const images = container.current.querySelectorAll('.portfolio-card img')
            const totalCards = Math.min(cards.length, 5) // Only first 5 for sticky

            if (!cards.length) return

            // Initial setup
            if (cards[0]) {
                gsap.set(cards[0], { y: '0%', scale: 1, rotation: 0 })
                gsap.set(images[0], { scale: 1 })
            }

            for (let i = 1; i < totalCards; i++) {
                gsap.set(cards[i], { y: '100%', scale: 1, rotation: 0 })
                gsap.set(images[i], { scale: 1 })
            }

            const scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.sticky-portfolio',
                    start: 'top top',
                    end: `+=${window.innerHeight * (totalCards - 1)}`,
                    pin: true,
                    scrub: 0.5,
                },
            })

            for (let i = 0; i < totalCards - 1; i++) {
                const currentCard = cards[i]
                const currentImage = images[i]
                const nextCard = cards[i + 1]
                const position = i

                scrollTimeline.to(
                    currentCard,
                    {
                        scale: 0.5,
                        rotation: 10,
                        duration: 1,
                        ease: 'none',
                    },
                    position
                )

                scrollTimeline.to(
                    currentImage,
                    {
                        scale: 1.5,
                        duration: 1,
                        ease: 'none',
                    },
                    position
                )

                scrollTimeline.to(
                    nextCard,
                    {
                        y: '0%',
                        duration: 1,
                        ease: 'none',
                    },
                    position
                )
            }

            // Animate progress line synchronized with sticky cards
            if (progressLineRef.current) {
                gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: 'left' })

                gsap.to(progressLineRef.current, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.sticky-portfolio',
                        start: 'top top',
                        end: `+=${window.innerHeight * (totalCards - 1)}`,
                        scrub: 0.5,
                    }
                })
            }

            // Animate progress line for mobile
            if (progressLineMobileRef.current) {
                gsap.set(progressLineMobileRef.current, { scaleX: 0, transformOrigin: 'left' })

                gsap.to(progressLineMobileRef.current, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.sticky-portfolio',
                        start: 'top top',
                        end: `+=${window.innerHeight * (totalCards - 1)}`,
                        scrub: 0.5,
                    }
                })
            }

            // Control mobile text visibility based on portfolio section
            // Show when sticky cards appear, but keep visible even after leaving
            ScrollTrigger.create({
                trigger: '.sticky-portfolio',
                start: 'top top', // Only show when cards start sticking
                onEnter: () => setShowMobileText(true),
                onEnterBack: () => setShowMobileText(true),
                // No onLeave or onLeaveBack - text stays visible once shown
            })

            return () => {
                scrollTimeline.kill()
                ScrollTrigger.getAll().forEach((trigger) => {
                    if (trigger.vars.trigger === '.sticky-portfolio') {
                        trigger.kill()
                    }
                })
            }
        },
        { scope: container, dependencies: [showFullGallery] }
    )

    return (
        <section ref={container} className="bg-white relative overflow-hidden">
            {/* Sticky Portfolio Gallery with Title */}
            <div className="sticky-portfolio relative w-full min-h-screen flex flex-col items-center justify-start pt-12 md:pt-24 bg-white">
                {/* Title */}
                <div className="text-center px-8 mb-8 md:mb-12">
                    <h2 className="text-5xl md:text-7xl font-semibold text-[#0046b8] mb-4">
                        {t('portfolio.title')}
                    </h2>
                    <div className="h-1 w-24 bg-[#0046b8] mx-auto rounded-full" />
                </div>

                {/* Cards Container */}
                <div className="relative w-full max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
                        {/* Sticky Cards - Left side */}
                        <div className="cards-container relative w-full md:w-[70%] lg:w-[65%] h-[60vh] md:h-[65vh] rounded-2xl overflow-hidden mb-24 md:mb-0">
                            {portfolioImages.slice(0, 5).map((item, index) => (
                                <div
                                    key={index}
                                    className="portfolio-card absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                                </div>
                            ))}
                        </div>

                        {/* Ver Más Text - Right side, vertically centered */}
                        <div
                            onClick={() => setShowFullGallery(true)}
                            className="hidden md:flex flex-col justify-center cursor-pointer group flex-1 pl-8 lg:pl-12 xl:pl-16"
                        >
                            <p className="text-2xl lg:text-3xl xl:text-4xl font-medium text-[#0046b8] mb-3 transition-all group-hover:scale-105">
                                {t('portfolio.view_full')} →
                            </p>
                            <div className="w-full max-w-xs h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    ref={progressLineRef}
                                    className="h-full bg-[#0046b8] origin-left"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ver Más Text Mobile - Fixed at bottom */}
                    <div className={`md:hidden fixed bottom-8 left-0 right-0 z-50 px-8 transition-all duration-300 ${showMobileText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
                        <div
                            onClick={() => setShowFullGallery(true)}
                            className="cursor-pointer group"
                        >
                            <p className="text-xl font-medium text-[#0046b8] mb-2 transition-all group-hover:scale-105 text-center">
                                {t('portfolio.view_full')} →
                            </p>
                            <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    ref={progressLineMobileRef}
                                    className="h-full bg-[#0046b8] origin-left"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Gallery Modal */}
            <AnimatePresence>
                {showFullGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] overflow-y-auto"
                        onClick={() => setShowFullGallery(false)}
                    >
                        <div className="min-h-screen p-8" onClick={(e) => e.stopPropagation()}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowFullGallery(false)}
                                className="fixed top-6 right-6 bg-white text-[#0046b8] p-3 rounded-full hover:bg-gray-100 transition-colors z-[10010]"
                            >
                                <X size={24} />
                            </button>

                            {/* Title */}
                            <h3 className="text-4xl md:text-5xl font-semibold text-white text-center mb-12 pt-8">
                                {t('portfolio.full_gallery_title')}
                            </h3>

                            {/* Grid of Images */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                                {portfolioImages.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedImage(item)}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <p className="text-white font-semibold text-sm">{item.title}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Detail Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[10050] flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors z-[10060]"
                        >
                            <X size={24} />
                        </button>

                        <div className="max-w-7xl w-full h-full flex flex-col md:flex-row items-center gap-8" onClick={(e) => e.stopPropagation()}>
                            {/* Image */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex-1 max-h-[70vh] flex items-center justify-center"
                            >
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            </motion.div>

                            {/* Info Panel */}
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full md:w-96 bg-white rounded-2xl p-8 max-h-[80vh] overflow-y-auto"
                            >
                                <h3 className="text-3xl font-semibold text-[#0046b8] mb-4">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {selectedImage.description}
                                </p>

                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        {t('portfolio.services_performed')}
                                    </h4>
                                    <ul className="space-y-3">
                                        {selectedImage.services.map((service, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <span className="w-2 h-2 bg-[#0046b8] rounded-full mr-3" />
                                                {service}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="mt-8 w-full bg-[#0046b8] text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    {t('portfolio.close')}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    )
}

export default PortfolioGallery
