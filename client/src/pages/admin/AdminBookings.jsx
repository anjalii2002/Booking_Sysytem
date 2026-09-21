import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import { Calendar, Filter, User, Clock } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', date: '' });

  const fetchBookings = () => {
    setLoading(true);
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.date) params.date = filters.date;
    adminApi
      .bookings(params)
      .then(({ data }) => setBookings(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Booking Master Log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive audit record of member workspace reservations.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
          Total Logs: <span className="text-slate-900">{bookings.length} entries</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchBookings();
        }}
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-end gap-4"
      >
        <div className="space-y-1.5 flex-1 w-full">
          <label className="text-xs font-medium text-slate-700 block">Filter Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-1.5 flex-1 w-full">
          <label className="text-xs font-medium text-slate-700 block">Filter Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 self-end"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Apply Filter</span>
        </button>
      </form>

      {/* Content List */}
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No booking records found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try resetting your status or date filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center uppercase flex-shrink-0 mt-0.5">
                  {b.user?.name ? b.user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{b.space?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {b.user?.name} ({b.user?.email})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {b.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.startTime} - {b.endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
                <StatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
