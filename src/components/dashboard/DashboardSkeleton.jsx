import React from 'react'

const DashboardSkeleton = ({ isDarkMode }) => {
    return (
        <div className="min-h-screen animate-pulse">
            {/* Welcome Header Skeleton */}
            <div className="mb-8 md:mb-12">
                <div className={`h-10 md:h-14 w-3/4 md:w-1/2 rounded-xl mb-4 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                <div className={`h-6 w-1/2 md:w-1/3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
            </div>

            {/* Main Content Card Skeleton */}
            <div className={`${isDarkMode ? 'bg-transparent' : 'bg-white rounded-[2.5rem] shadow-2xl'} p-6 md:p-12 transition-all duration-300`}>

                {/* Stats Overview Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 h-40 relative overflow-hidden`}>
                            <div className={`absolute top-4 right-4 w-20 h-20 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-200/50'}`}></div>
                            <div className={`h-4 w-1/3 rounded mb-4 mt-auto ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            <div className={`h-10 w-1/2 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Vehicles Skeleton */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex justify-between items-center mb-6">
                            <div className={`h-8 w-40 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            <div className={`h-8 w-32 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-3xl p-6 h-64`}>
                                    <div className="flex justify-between mb-4">
                                        <div className={`h-6 w-24 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        <div className={`h-6 w-16 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    </div>
                                    <div className={`h-8 w-32 rounded mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 w-20 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>

                                    <div className="mt-8 flex justify-between items-end">
                                        <div className={`h-20 w-32 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-200/50'}`}></div>
                                        <div className={`h-10 w-24 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Recent Activity Skeleton */}
                    <div className="space-y-8">
                        <div className={`h-8 w-48 rounded-lg mb-6 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>

                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-2xl p-4 h-24`}>
                                    <div className="flex justify-between mb-2">
                                        <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        <div className={`h-5 w-20 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    </div>
                                    <div className={`h-3 w-24 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardSkeleton
