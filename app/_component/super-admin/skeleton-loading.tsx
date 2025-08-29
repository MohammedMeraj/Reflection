export const SuperAdminSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Welcome Message Skeleton */}
      <div className="px-4 mb-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Monthly Overview Skeleton */}
      <div className="px-4 mb-6">
        <div className="bg-gray-200 rounded-xl p-4 h-24"></div>
      </div>

      {/* Department Overview Skeleton */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded ml-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institution Overview Skeleton */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded ml-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
