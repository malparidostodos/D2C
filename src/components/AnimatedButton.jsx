import React from 'react'
import { Link } from 'react-router-dom'

const AnimatedButton = ({
    children,
    href,
    onClick,
    className = '',
    variant = 'primary',
    type = 'button',
    disabled = false,
    state = null
}) => {
    const baseClasses = "inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 text-arrow-wrapper select-none group relative"

    const variants = {
        primary: "bg-white text-black hover:bg-[#0046b8] hover:text-white",
        white: "bg-white text-black hover:bg-[#0046b8] hover:text-white",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
        accent: "bg-accent text-white hover:bg-accent/90"
    }

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
    const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${disabledClasses} ${className}`

    const content = (
        <>
            <span className="absolute left-6 top-1/2 -translate-y-1/2">
                <span className="text-arrow-icon-wrapper">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </span>
            <span className="text-arrow-text select-none">{children}</span>
        </>
    )

    if (href && !disabled) {
        if (href.startsWith('#')) {
            return (
                <a href={href} onClick={onClick} className={combinedClasses}>
                    {content}
                </a>
            )
        }
        return (
            <Link to={href} state={state} onClick={onClick} className={combinedClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
            {content}
        </button>
    )
}

export default AnimatedButton
