import React from 'react'

const RateServiceSkeleton = ({ isDarkMode }) => {
    return (
        <div className="pb-20 px-4 md:px-8 lg:pt-20 max-w-2xl mx-auto w-full">
            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="text-center mb-8">
                    <div className={`h-10 w-64 mx-auto rounded-lg mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <div className={`h-6 w-96 max-w-full mx-auto rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                </div>

                {/* Main Content Card Skeleton */}
                <div className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200 shadow-xl'} border rounded-3xl p-8`}>
                    {/* Booking Summary Skeleton */}
                    <div className={`flex items-center gap-6 mb-8 pb-8 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                        <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                        <div className="flex-1">
                            <div className={`h-6 w-48 rounded mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            <div className="flex gap-4">
                                <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Section Skeleton */}
                    <div className="text-center mb-8">
                        <div className={`h-4 w-32 mx-auto rounded mb-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>

                    {/* Comment Section Skeleton */}
                    <div className="mb-8">
                        <div className={`h-4 w-48 rounded mb-2 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                        <div className={`h-32 w-full rounded-xl ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border`}></div>
                    </div>

                    {/* Public Toggle Skeleton */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border mb-8 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`w-12 h-6 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                        <div className={`h-4 flex-1 max-w-xs rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                    </div>

                    {/* Submit Button Skeleton */}
                    <div className={`h-12 w-full rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>
            </div>
        </div>
    )
}

export default RateServiceSkeleton
