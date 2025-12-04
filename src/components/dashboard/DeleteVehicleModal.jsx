import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DeleteVehicleModal = ({ isOpen, onClose, onConfirm, plate, isDarkMode }) => {
    const { t } = useTranslation()

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-6 md:p-8 max-w-md w-full text-center`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <AlertCircle size={32} className="text-red-500" />
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.delete_vehicle_title')}</h2>
                <p className={`mb-8 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                    {t('dashboard.delete_vehicle_confirm', { plate })}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default DeleteVehicleModal
