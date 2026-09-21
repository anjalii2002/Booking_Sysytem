import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { spacesApi } from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  Search,
  Filter,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Active applied filters
  const [filters, setFilters] = useState({ search: '', type: '', capacity: '', date: '' });

  const fetchSpaces = useCallback(async (page = 1, activeFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 9 };
      if (activeFilters.search?.trim()) params.search = activeFilters.search.trim();
      if (activeFilters.type) params.type = activeFilters.type;
      if (activeFilters.capacity) params.capacity = activeFilters.capacity;
      if (activeFilters.date) params.date = activeFilters.date;

      const { data } = await spacesApi.list(params);
      setSpaces(data.data.spaces || []);
      setPagination(data.data.pagination || { page: 1, limit: 9, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load spaces');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchSpaces(1, filters);
  }, []);

  // Handle explicit filter form submission
  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    fetchSpaces(1, filters);
  };

  // Immediate update helper for dropdowns/inputs
  const updateFilterField = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    fetchSpaces(1, updated);
  };

  // Reset all filters
  const handleClearFilters = () => {
    const cleared = { search: '', type: '', capacity: '', date: '' };
    setFilters(cleared);
    fetchSpaces(1, cleared);
  };

  const hasActiveFilters = Boolean(filters.search || filters.type || filters.capacity || filters.date);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Workspaces & Meeting Rooms
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse available individual desks, executive suites, and conference rooms.
          </p>
        </div>

        {!loading && (
          <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs self-start md:self-auto">
            Total Available: <span className="text-slate-900 font-bold">{pagination.total}</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Workspace</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or type..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterSubmit(e)}
                className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => updateFilterField('search', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Type Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Space Type</span>
            </label>
            <select
              value={filters.type}
              onChange={(e) => updateFilterField('type', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-all"
            >
              <option value="">All Types</option>
              <option value="desk">Individual Desk</option>
              <option value="meeting_room">Meeting Room</option>
            </select>
          </div>

          {/* Capacity Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Min Capacity</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="Any capacity"
              value={filters.capacity}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              onBlur={() => fetchSpaces(1, filters)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Available Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Available Date</span>
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => updateFilterField('date', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Applied Filter Chips & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Active Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters ? (
              <>
                <span className="text-xs font-medium text-slate-500">Active Filters:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                    Search: "{filters.search}"
                    <button type="button" onClick={() => updateFilterField('search', '')}>
                      <X className="w-3 h-3 text-teal-600 hover:text-teal-900" />
                    </button>
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                    Type: {filters.type.replace('_', ' ')}
                    <button type="button" onClick={() => updateFilterField('type', '')}>
                      <X className="w-3 h-3 text-teal-600 hover:text-teal-900" />
                    </button>
                  </span>
                )}
                {filters.capacity && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                    Capacity: {filters.capacity}+
                    <button type="button" onClick={() => updateFilterField('capacity', '')}>
                      <X className="w-3 h-3 text-teal-600 hover:text-teal-900" />
                    </button>
                  </span>
                )}
                {filters.date && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                    Date: {filters.date}
                    <button type="button" onClick={() => updateFilterField('date', '')}>
                      <X className="w-3 h-3 text-teal-600 hover:text-teal-900" />
                    </button>
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-400">No active filters applied.</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : spaces.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No matching spaces found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any workspace matching your filter parameters. Try clearing your filters or changing the search terms.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Link
                key={space._id}
                to={`/spaces/${space._id}`}
                className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {space.name}
                  </h3>
                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                    {space.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium mb-3">
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Capacity: {space.capacity} {space.capacity === 1 ? 'Person' : 'People'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 flex-1">
                  {space.description || 'No description provided for this space.'}
                </p>

                {space.amenities && space.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {space.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
                        {a}
                      </span>
                    ))}
                    {space.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
                        +{space.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800 mt-auto">
                  <span>View Availability & Book</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchSpaces(pagination.page - 1, filters)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-medium text-slate-500">
                Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
                <span className="font-bold text-slate-900">{pagination.totalPages}</span>
              </span>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchSpaces(pagination.page + 1, filters)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
