import React from 'react'

const UserReviewsSkeleton = ({ isDarkMode }) => {
    return (
        <div className={`pt-32 pb-20 px-4 md:px-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="max-w-7xl mx-auto animate-pulse">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className={`h-10 w-64 rounded-lg mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <div className={`h-6 w-96 max-w-full rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                </div>

                {/* Reviews Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200 shadow-sm'} border rounded-3xl p-6`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className={`h-5 w-32 rounded mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 w-24 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className={`w-3.5 h-3.5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-6 space-y-2">
                                <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                            </div>

                            {/* Footer */}
                            <div className={`flex justify-between items-center pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <div className={`h-6 w-16 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                <div className={`h-8 w-8 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserReviewsSkeleton
