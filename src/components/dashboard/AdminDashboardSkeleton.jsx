import React from 'react'

const AdminDashboardSkeleton = ({ isDarkMode }) => {
    return (
        <div className={`pt-32 pb-20 px-4 md:px-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="max-w-7xl mx-auto animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className={`h-10 w-64 rounded-lg mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                        <div className={`h-6 w-48 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                    </div>
                    <div className={`h-10 w-full md:w-32 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`border rounded-2xl p-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-8 w-8 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}></div>
                            </div>
                            <div className={`h-8 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search Skeleton */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className={`h-12 flex-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white border border-gray-200'}`}></div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className={`h-10 w-24 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Bookings List Skeleton */}
                <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-transparent md:bg-white/5 md:border md:border-white/10' : 'bg-transparent md:bg-white md:border md:border-gray-200'}`}>
                    {/* Mobile View Skeleton */}
                    <div className="md:hidden space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`border rounded-xl p-5 space-y-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className={`h-6 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        <div className={`h-4 w-48 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    </div>
                                    <div className={`h-6 w-20 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="space-y-1">
                                            <div className={`h-3 w-16 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                            <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View Skeleton */}
                    <div className="hidden md:block">
                        <div className={`h-12 border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}></div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`h-20 border-b flex items-center px-4 gap-4 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-6 w-24 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 w-20 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-8 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardSkeleton
