import React from 'react'
import { motion } from 'framer-motion'
import { Moon } from 'lucide-react'

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-500 focus:outline-none ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
                }`}
            aria-label="Toggle Theme"
        >
            <motion.div
                className={`w-6 h-6 rounded-full shadow-sm flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'
                    }`}
                animate={{
                    x: isDarkMode ? 0 : 24, // Left for Dark (Moon), Right for Light (Sun/Circle)
                    rotate: isDarkMode ? 0 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {isDarkMode ? (
                    <Moon size={14} className="text-gray-200 fill-gray-200" />
                ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-800" />
                )}
            </motion.div>
        </button>
    )
}

export default ThemeToggle
