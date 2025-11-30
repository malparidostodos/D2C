import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import DashboardSidebar from '../dashboard/DashboardSidebar'

const DashboardLayout = () => {
    const navigate = useNavigate()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('dashboardTheme')
        return saved ? JSON.parse(saved) : false
    })

    useEffect(() => {
        localStorage.setItem('dashboardTheme', JSON.stringify(isDarkMode))
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    useEffect(() => {
        checkAdminStatus()
    }, [])

    const checkAdminStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase.rpc('is_admin')
            setIsAdmin(!!data)
        }
    }

    const toggleTheme = () => setIsDarkMode(!isDarkMode)
    const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed)

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#050505]' : 'bg-gray-50'}`}>
            <DashboardSidebar
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAdmin={isAdmin}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={toggleCollapse}
            />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
                <div className="p-4 md:p-8 pt-20 lg:pt-8">
                    <Outlet context={{ isDarkMode, isAdmin }} />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
