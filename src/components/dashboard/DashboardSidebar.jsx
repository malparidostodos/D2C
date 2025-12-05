import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, Settings, LogOut, Shield, Menu, X, ChevronRight, MessageSquare } from 'lucide-react'
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
        <line x1="3" y1="6" x2="21" y2="6" />     {/* Línea 1 */}
        <line x1="7" y1="12" x2="21" y2="12" />    {/* Línea 2 (recortada a la izquierda) */}
        <line x1="11" y1="18" x2="21" y2="18" />   {/* Línea 3 */}
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
        { icon: MessageSquare, label: t('dashboard.reviews'), path: '/reviews' },
        ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
    ]

    const SidebarContent = ({ isMobile = false }) => {
        const [langOpen, setLangOpen] = useState(false)
        const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'ES'
        const languages = [
            { code: 'es', label: 'Español' },
            { code: 'en', label: 'English' }
        ]

        // Force expanded state for mobile
        const effectiveCollapsed = isMobile ? false : isCollapsed

        const handleLanguageChange = (langCode) => {
            const targetLang = langCode.toLowerCase();
            const currentPath = location.pathname;

            // Don't change if already on the target language
            if (i18n.language?.startsWith(targetLang)) {
                setLangOpen(false);
                return;
            }

            let newPath = currentPath;

            if (targetLang === 'en') {
                if (!currentPath.startsWith('/en')) {
                    newPath = `/en${currentPath === '/' ? '' : currentPath}`;
                }
            } else {
                // Switch to ES (remove /en)
                if (currentPath.startsWith('/en')) {
                    newPath = currentPath.replace(/^\/en/, '') || '/';
                }
            }

            // Explicitly change language in i18n
            i18n.changeLanguage(targetLang);

            // Force hard navigation to ensure language switch applies correctly
            if (newPath !== currentPath) {
                window.location.href = newPath;
            } else {
                window.location.reload();
            }

            setLangOpen(false);
        };

        // Animation variants for mobile
        const containerVariants = {
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1
                }
            }
        }

        const itemVariants = {
            hidden: {
                opacity: 0,
                x: -20
            },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                }
            }
        }

        return (
            <motion.div
                className="flex flex-col h-full"
                variants={isMobile ? containerVariants : undefined}
                initial={isMobile ? "hidden" : undefined}
                animate={isMobile ? "visible" : undefined}
            >
                {/* Logo Area */}
                <motion.div
                    variants={isMobile ? itemVariants : undefined}
                    className={`${isMobile ? 'pt-8 pb-6 px-6' : 'p-6'} mb-6 flex items-center relative h-[60px] ${effectiveCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                    <Link
                        to={getLocalizedPath('/')}
                        className={`text-2xl font-display font-bold text-white tracking-tighter hover:opacity-80 transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${effectiveCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto delay-100'}`}
                    >
                        Ta' <span className="text-accent">To'</span> Clean
                    </Link>

                    {/* Desktop Toggle (Visible only on desktop) */}
                    <button
                        onClick={toggleCollapse}
                        className={`absolute top-1/2 right-0 -translate-y-1/2 h-[60px] min-w-[50px] text-center leading-[60px] cursor-pointer transition-all duration-500 ease-in-out text-gray-400 hover:text-white hidden lg:block ${!effectiveCollapsed ? 'text-right' : ''}`}
                    >
                        {effectiveCollapsed ? <Menu size={23} /> : <CustomMenuIcon size={23} />}
                    </button>
                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname.includes(item.path)
                        return (
                            <motion.div
                                key={item.path}
                                variants={isMobile ? itemVariants : undefined}
                            >
                                <Link
                                    to={getLocalizedPath(item.path)}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        } ${effectiveCollapsed ? 'justify-center' : 'gap-3'}`}
                                >
                                    <item.icon size={20} className={`min-w-[20px] ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                                    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                                        {item.label}
                                    </span>
                                    {!effectiveCollapsed && isActive && (
                                        <ChevronRight size={16} className="ml-auto opacity-50 transition-opacity duration-300 delay-150" />
                                    )}

                                    {/* Custom Tooltip */}
                                    {effectiveCollapsed && (
                                        <div className="absolute left-full ml-6 px-3 py-2 bg-white text-black text-sm font-medium rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            </motion.div>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mt-auto space-y-4 border-t border-white/5">
                    {/* Language Selector (Navbar Style with Label) */}
                    <motion.div
                        variants={isMobile ? itemVariants : undefined}
                        className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2`}
                    >
                        <span className={`text-sm text-gray-400 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                            {t('common.language', 'Idioma')}
                        </span>

                        <div className={`relative ${effectiveCollapsed ? '' : ''}`}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className={`group relative flex items-center justify-center gap-2 !bg-white/10 !backdrop-blur-md !border !border-white/10 !text-white hover:!bg-white/20 transition-all duration-300 rounded-xl ${effectiveCollapsed ? 'w-10 h-10 p-0' : 'px-3 py-2'}`}
                            >
                                <span className="_icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                        <path d="M12 22C17.5228 22 22 17.5229 22 12C22 6.47716 17.5228 2 12 2C6.47716 2 2 6.47716 2 12C2 17.5229 6.47715 22 12 22Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3 9H21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3 15H21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M12 2C14.5013 4.73836 15.9228 8.29204 16 12C15.9228 15.708 14.5013 19.2617 12 22C9.49872 19.2617 8.07725 15.708 8 12C8.07725 8.29204 9.49872 4.73836 12 2V2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                {!effectiveCollapsed && (
                                    <>
                                        <span className="text-sm">{currentLang}</span>
                                        <span className={`ml-1 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 13.9393L6.53033 8.46967L5.46967 9.53033L10.409 14.4697C11.2877 15.3483 12.7123 15.3484 13.591 14.4697L18.5303 9.53033L17.4697 8.46967L12 13.9393Z" fill="currentColor"></path>
                                            </svg>
                                        </span>
                                    </>
                                )}
                                {effectiveCollapsed && (
                                    <div className="absolute left-full ml-6 px-3 py-2 bg-white text-black text-sm font-medium rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                        {t('common.language')}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {langOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className={`absolute bottom-full mb-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 ${effectiveCollapsed ? 'left-0 w-40' : 'right-0 w-32'}`}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${i18n.language?.startsWith(lang.code)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    {lang.label}
                                                    {i18n.language?.startsWith(lang.code) && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={isMobile ? itemVariants : undefined}
                        className={`flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2`}
                    >
                        <span className={`text-sm text-gray-400 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                            {t('common.theme', 'Tema')}
                        </span>
                        <div className={`${effectiveCollapsed ? 'scale-75' : ''} transition-transform duration-300`}>
                            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                        </div>
                    </motion.div>

                    <motion.button
                        variants={isMobile ? itemVariants : undefined}
                        onClick={handleLogout}
                        className={`relative w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group ${effectiveCollapsed ? 'justify-center' : 'gap-3'}`}
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform min-w-[20px]" />
                        <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${effectiveCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto delay-150'}`}>
                            {t('auth.logout', 'Cerrar Sesión')}
                        </span>

                        {/* Custom Tooltip for Logout */}
                        {effectiveCollapsed && (
                            <div className="absolute left-full ml-6 px-3 py-2 bg-white text-black text-sm font-medium rounded-md opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                {t('auth.logout', 'Cerrar Sesión')}
                            </div>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        )
    }

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
            <AnimatePresence mode="wait">
                {isMobileOpen && (
                    <>
                        {/* Enhanced Overlay with progressive blur */}
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{
                                opacity: 1,
                                backdropFilter: "blur(8px)",
                                transition: {
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1]
                                }
                            }}
                            exit={{
                                opacity: 0,
                                backdropFilter: "blur(0px)",
                                transition: {
                                    duration: 0.25,
                                    ease: [0.4, 0, 1, 1]
                                }
                            }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                            style={{ WebkitBackdropFilter: "blur(8px)" }}
                        />

                        {/* Enhanced Sidebar with smooth slide and fade */}
                        <motion.div
                            initial={{
                                x: -320,
                                opacity: 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                transition: {
                                    type: "spring",
                                    damping: 30,
                                    stiffness: 300,
                                    mass: 0.8,
                                    opacity: {
                                        duration: 0.25,
                                        ease: [0, 0, 0.2, 1]
                                    }
                                }
                            }}
                            exit={{
                                x: -320,
                                opacity: 0,
                                transition: {
                                    type: "spring",
                                    damping: 35,
                                    stiffness: 400,
                                    mass: 0.6,
                                    opacity: {
                                        duration: 0.2,
                                        ease: [0.4, 0, 1, 1]
                                    }
                                }
                            }}
                            className="fixed left-0 top-0 w-72 h-screen bg-[#050505] border-r border-white/10 z-50 lg:hidden shadow-2xl"
                        >
                            <motion.button
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{
                                    opacity: 1,
                                    rotate: 0,
                                    transition: { delay: 0.15, duration: 0.2 }
                                }}
                                exit={{
                                    opacity: 0,
                                    rotate: 90,
                                    transition: { duration: 0.15 }
                                }}
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10 cursor-pointer"
                            >
                                <X size={24} />
                            </motion.button>
                            <SidebarContent isMobile={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default DashboardSidebar
