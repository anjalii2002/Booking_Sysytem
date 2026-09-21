import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs animate-pulse space-y-4">
        {skeletons.map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4">
      {skeletons.map((_, i) => (
        <div key={i} className="h-12 bg-slate-200 rounded-lg w-full"></div>
      ))}
    </div>
  );
}
