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
    const baseClasses = "inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 text-arrow-wrapper select-none group/btn relative"

    const variants = {
        primary: "bg-white text-black hover:bg-[#0046b8] hover:text-white",
        white: "bg-white text-black hover:bg-[#0046b8] hover:text-white",
        black: "bg-black text-white hover:bg-[#0046b8] hover:text-white",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
        "outline-dark": "bg-transparent border border-gray-900/20 text-gray-900 hover:bg-gray-900/5 hover:border-gray-900/40",
        accent: "bg-accent text-white hover:bg-accent/90",
        blur: "bg-white/10 backdrop-blur-md border border-white/50 text-white hover:bg-white/30"
    }

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
    const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${disabledClasses} ${className}`

    const content = (
        <div className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover/btn:-translate-y-full">
                {children}
            </span>
            <span className="absolute top-0 left-0 w-full block transition-transform duration-300 translate-y-full group-hover/btn:translate-y-0">
                {children}
            </span>
        </div>
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
