import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText)

import ErrorBoundary from './components/layout/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
