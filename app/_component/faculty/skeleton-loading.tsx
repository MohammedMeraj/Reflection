"use client";

interface SkeletonProps {
  message?: string;
}

export const SkeletonLoading = ({ message = "Loading students..." }: SkeletonProps) => {
  return (
    <div className="p-4 w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <p className="text-gray-600">Please wait while we fetch the data</p>
      </div>
      
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-3 animate-pulse"></div>
        <div className="flex gap-2 overflow-x-auto mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded-full w-full mb-3 animate-pulse"></div>
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
      
      {/* Student list skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between py-3 px-4 bg-white rounded-xl shadow-sm"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};