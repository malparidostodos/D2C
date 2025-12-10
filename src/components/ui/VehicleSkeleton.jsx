import React from 'react'
import { motion } from 'framer-motion'

const VehicleSkeleton = () => {
    return (
        <div className="relative overflow-hidden p-6 rounded-3xl border-2 bg-white border-gray-200 dark:bg-white/5 dark:border-white/10 flex flex-col items-center gap-4 min-h-[240px] shadow-sm dark:shadow-none">
            {/* Nickname placeholder */}
            <div className="absolute top-3 right-3 w-20 h-4 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />

            {/* Image Placeholder */}
            <div className="flex-1 flex items-center justify-center mt-4 w-full">
                <div className="w-40 h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            </div>

            {/* Text Content Placeholder */}
            <div className="text-center w-full space-y-3">
                {/* Plate */}
                <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg mx-auto animate-pulse" />
                {/* Brand/Model */}
                <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded-full mx-auto animate-pulse" />
            </div>
        </div>
    )
}

export default VehicleSkeleton
