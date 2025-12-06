import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Copy, Eye, EyeOff, Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AccountCreatedModal = ({ isOpen, onClose, credentials }) => {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success(t('booking.password_copied'))
    }

    if (!isOpen || !credentials) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-0 text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <User className="w-8 h-8 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-2">
                                {t('booking.account_created_title')} 👤
                            </h2>
                            <p className="text-white/60 text-sm">
                                {t('booking.account_created_message')}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Email Field */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">
                                    {t('booking.credentials_email')}
                                </span>
                                <span className="text-white font-mono font-medium text-lg break-all">
                                    {credentials.email}
                                </span>
                            </div>

                            {/* Password Field */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">
                                    {t('booking.credentials_password')}
                                </span>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-mono font-medium text-lg">
                                        {showPassword ? credentials.password : '••••••••'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(credentials.password)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="flex gap-3 items-start bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                <span className="text-lg">🔒</span>
                                <p className="text-yellow-200/80 text-xs leading-relaxed">
                                    {t('booking.credentials_save_reminder')}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 pt-0">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {t('booking.understood_go_to_account')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default AccountCreatedModal
