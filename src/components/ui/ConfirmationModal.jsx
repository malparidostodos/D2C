import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDarkMode,
    variant = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null

    const getIcon = () => {
        return <X size={32} className={(variant === 'danger' || variant === 'critical') ? 'text-red-500' : 'text-blue-500'} />
    }

    const getIconBg = () => {
        if (isDarkMode) {
            return (variant === 'danger' || variant === 'critical') ? 'bg-red-500/10' : 'bg-blue-500/10'
        }
        return (variant === 'danger' || variant === 'critical') ? 'bg-red-50' : 'bg-blue-50'
    }

    const getConfirmButtonClass = () => {
        if (variant === 'danger' || variant === 'critical') {
            return "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
        }
        return "bg-blue-600 text-white hover:bg-blue-700"
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`${isDarkMode ? 'bg-[#111]' : 'bg-white'} ${variant === 'critical' ? 'border-2 border-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]' : (isDarkMode ? 'border-white/10' : 'border-gray-200')} border rounded-3xl p-6 md:p-8 max-w-md w-full text-center relative shadow-2xl`}
                    >
                        {/* El modal de ejemplo NO tiene botón de cerrar (X) en la esquina superior derecha, solo botones abajo */}

                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${getIconBg()}`}>
                            {getIcon()}
                        </div>

                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </h2>
                        <p className={`mb-8 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-colors ${getConfirmButtonClass()}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ConfirmationModal
