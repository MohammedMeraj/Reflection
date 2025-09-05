"use client";

export const DepartmentHeadDashboardSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Department Admin Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Department Admin</h1>
          
          {/* Profile Icon Skeleton */}
          <div className="flex items-center gap-2 p-2 rounded-lg">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content with top padding for fixed header */}
      <div className="pt-32 pb-20 px-4 max-w-md mx-auto space-y-6">
        {/* Header with Department Name Skeleton */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div>
            <div className="h-7 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-12"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-12"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-16"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-8"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Selector Skeleton */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-24"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse col-span-2"></div>
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-28"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-24"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
