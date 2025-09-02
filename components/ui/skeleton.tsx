import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

// Card Skeleton for lists
function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div>
          <Skeleton className="h-3 w-14 mb-1" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      <div className="p-2 bg-gray-50 rounded-md">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

// Header Skeleton
function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="relative">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Stats Grid Skeleton
function StatsGridSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <div>
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-6 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Department Head Home Skeleton
function DepartmentHeadHomeSkeleton() {
  return (
    <div className="p-4 max-w-md mx-auto space-y-6 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        
        <StatsGridSkeleton />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Lab Management Skeleton
function LabManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSkeleton />
      
      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Faculty Management Skeleton
function FacultyManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSkeleton />
      
      <div className="p-4 max-w-md mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="p-2 bg-purple-50 rounded-md">
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Class Management Skeleton
function ClassManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSkeleton />
      
      <div className="p-4 max-w-md mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <Skeleton className="h-3 w-8 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-16" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Attendance Skeleton
function AttendanceSkeleton() {
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <Skeleton className="h-5 w-28 mb-3" />
        
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 shadow-sm text-center">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile Skeleton
function ProfileSkeleton() {
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm text-center">
        <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <Skeleton className="h-5 w-24 mb-3" />
        
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Super Admin Skeleton
function SuperAdminSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col items-center justify-center mt-4">
          <Skeleton className="w-16 h-16 rounded-full mb-3" />
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Welcome Message Skeleton */}
      <div className="px-4 mb-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="w-10 h-10 rounded-full mb-2" />
              <Skeleton className="h-6 w-8 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Monthly Overview Skeleton */}
      <div className="px-4 mb-6">
        <Skeleton className="rounded-xl h-24 w-full" />
      </div>

      {/* Department Overview Skeleton */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto mb-1" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              </div>
              
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Subject Management Skeleton
function SubjectManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSkeleton />
      
      <div className="p-4 max-w-md mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="p-2 bg-gray-50 rounded-md">
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { 
  Skeleton,
  CardSkeleton,
  HeaderSkeleton,
  StatsGridSkeleton,
  DepartmentHeadHomeSkeleton,
  LabManagementSkeleton,
  FacultyManagementSkeleton,
  ClassManagementSkeleton,
  SubjectManagementSkeleton,
  AttendanceSkeleton,
  ProfileSkeleton,
  SuperAdminSkeleton
}
