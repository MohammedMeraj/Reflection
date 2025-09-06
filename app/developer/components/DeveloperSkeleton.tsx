export function DeveloperSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-96"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded w-40"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div>
                <div className="h-6 bg-slate-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="h-12 bg-slate-200 rounded-xl w-80"></div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded w-20"></div>
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-200 last:border-0">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="w-8 h-8 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
