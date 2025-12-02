export const ESSENTIAL_STORAGE_KEYS = [
    'cookie_consent',
    'theme',
    'sb-', // Supabase tokens prefix
    'supabase.auth.token' // Supabase auth token
]

export const manageCookies = (consent) => {
    if (consent) {
        localStorage.setItem('cookie_consent', 'accepted')
        // Initialize marketing scripts here if we had any
        // initAnalytics() 
    } else {
        localStorage.setItem('cookie_consent', 'declined')
        clearMarketingCookies()
    }
}

export const clearMarketingCookies = () => {
    // Clear cookies
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()

        // Check if it's an essential cookie
        const isEssential = ESSENTIAL_STORAGE_KEYS.some(key => name.startsWith(key))

        if (!isEssential) {
            // Delete cookie
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
        }
    }

    // Clear non-essential localStorage
    // We iterate backwards because we might remove items
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        const isEssential = ESSENTIAL_STORAGE_KEYS.some(essentialKey => key.startsWith(essentialKey))

        if (!isEssential) {
            localStorage.removeItem(key)
        }
    }
}
