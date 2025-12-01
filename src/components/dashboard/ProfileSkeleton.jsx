import React from 'react'

const ProfileSkeleton = ({ isDarkMode }) => {
    return (
        <div className={`min-h-screen animate-pulse ${isDarkMode ? 'bg-[#050505]' : 'bg-gray-50'}`}>
            {/* Hero Section Skeleton */}
            <div className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[95%] mx-auto">
                    <div className={`h-12 md:h-16 w-48 md:w-64 rounded-xl mb-4 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <div className={`h-6 w-64 md:w-96 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-200/50'}`}></div>
                </div>
            </div>

            {/* Main Content Card Skeleton */}
            <div className="px-2 sm:px-4 pb-12">
                <div className={`max-w-[95%] mx-auto ${isDarkMode ? 'bg-[#111] border border-white/10' : 'bg-white'} rounded-[2.5rem] shadow-2xl p-8 md:p-12 min-h-[600px]`}>
                    <div className="max-w-5xl mx-auto">

                        {/* Avatar Section Skeleton */}
                        <div className="mb-12">
                            <div className={`h-6 w-20 rounded mb-4 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className={`w-24 h-24 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'} flex-shrink-0`}></div>
                                <div className={`flex-1 w-full md:w-auto h-24 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Left Column Skeleton */}
                            <div className="space-y-8">
                                {/* Name Input Skeleton */}
                                <div className="space-y-2">
                                    <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    <div className={`h-14 w-full rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                </div>

                                {/* Email Input Skeleton */}
                                <div className="space-y-2">
                                    <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    <div className={`h-14 w-full rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    <div className={`h-3 w-48 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                </div>

                                {/* Phone Input Skeleton */}
                                <div className="space-y-2">
                                    <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    <div className="flex gap-2">
                                        <div className={`h-14 w-[100px] rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                        <div className={`h-14 flex-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    </div>
                                    <div className={`h-3 w-48 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                </div>
                            </div>

                            {/* Right Column Skeleton */}
                            <div className="space-y-8">
                                {/* Password Inputs Skeleton */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className={`h-4 w-40 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        <div className={`h-14 w-full rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className={`h-4 w-40 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                        <div className={`h-14 w-full rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                                    </div>

                                    {/* Button Skeleton */}
                                    <div className="flex justify-end">
                                        <div className={`h-12 w-40 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSkeleton
