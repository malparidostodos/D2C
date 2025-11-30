import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, Settings, LogOut, Shield, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const CustomMenuIcon = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="11" y1="18" x2="21" y2="18" />
    </svg>
)

const DashboardSidebar = ({ isDarkMode, toggleTheme, isAdmin, isCollapsed, toggleCollapse }) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const getLocalizedPath = (path) => {
        const currentLang = i18n.language
        return currentLang === 'en' ? `/en${path}` : path
    }

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            toast.success(t('auth.logout_success', 'Sesión cerrada exitosamente'))
            navigate(getLocalizedPath('/'))
        } catch (error) {
            console.error('Error logging out:', error)
            toast.error(t('auth.logout_error', 'Error al cerrar sesión'))
        }
    }

    const navItems = [
        { icon: LayoutDashboard, label: t('dashboard.title', 'Dashboard'), path: '/dashboard' },
        { icon: User, label: t('profile.title', 'Perfil'), path: '/profile' },
        ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
    ]

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className={`p-6 mb-6 flex items-center relative h-[60px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <Link
                    to={getLocalizedPath('/')}
                    className={`text-2xl font-display font-bold text-white tracking-tighter hover:opacity-80 transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto delay-100'}`}
                >
                    Ta' <span className="text-accent">To'</span> Clean
                </Link>

                {/* Desktop Toggle (Visible only on desktop) */}
                <button
                    onClick={toggleCollapse}
                    className={`absolute top-1/2 right-0 -translate-y-1/2 h-[60px] min-w-[50px] text-center leading-[60px] cursor-pointer transition-all duration-500 ease-in-out text-gray-400 hover:text-white hidden lg:block ${!isCollapsed ? 'text-right' : ''}`}
                >
                    {isCollapsed ? <Menu size={23} /> : <CustomMenuIcon size={23} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.path)
                    return (
                        <Link
                            key={item.path}
                            to={getLocalizedPath(item.path)}
                            onClick={() => setIsMobileOpen(false)}
                            className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                        >
                            <item.icon size={20} className={`min-w-[20px] ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                                {item.label}
                            </span>
                            {!isCollapsed && isActive && (
                                <ChevronRight size={16} className="ml-auto opacity-50 transition-opacity duration-300 delay-150" />
                            )}

                            {/* Custom Tooltip */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-2 bg-white text-black text-sm font-medium rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto space-y-4 border-t border-white/5">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2`}>
                    <span className={`text-sm text-gray-400 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                        {t('common.theme', 'Tema')}
                    </span>
                    <div className={`${isCollapsed ? 'scale-75' : ''} transition-transform duration-300`}>
                        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform min-w-[20px]" />
                    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                        {t('auth.logout', 'Cerrar Sesión')}
                    </span>

                    {/* Custom Tooltip for Logout */}
                    {isCollapsed && (
                        <div className="absolute left-full ml-6 px-3 py-2 bg-white text-black text-sm font-medium rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                            {t('auth.logout', 'Cerrar Sesión')}
                        </div>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-[#111] text-white border border-white/10 shadow-lg"
            >
                <Menu size={24} />
            </button>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:block h-screen fixed left-0 top-0 bg-[#050505] border-r border-white/5 z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 w-72 h-screen bg-[#050505] border-r border-white/10 z-50 lg:hidden"
                        >
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default DashboardSidebar
