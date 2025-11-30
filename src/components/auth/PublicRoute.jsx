import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useTranslation } from 'react-i18next'

const PublicRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const { i18n } = useTranslation()
    const location = useLocation()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }
        checkAuth()
    }, [])

    if (isAuthenticated === null) {
        return null // O un spinner de carga minimalista
    }

    if (isAuthenticated) {
        const currentLang = i18n.language
        const dashboardPath = currentLang === 'en' ? '/en/dashboard' : '/dashboard'
        return <Navigate to={dashboardPath} replace />
    }

    return <Outlet />
}

export default PublicRoute
