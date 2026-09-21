import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  Calendar,
  Clock,
  Building2,
  Plus,
  CalendarCheck,
  Ban,
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { showToast } = useToast();

  const fetchBookings = () => {
    setLoading(true);
    bookingsApi
      .my()
      .then(({ data }) => setBookings(data.data))
      .catch(() => showToast('Failed to load bookings', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await bookingsApi.cancel(cancelId);
      showToast('Booking cancelled');
      setCancelId(null);
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Cancel failed', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const canCancel = (b) => {
    if (!['pending', 'approved'].includes(b.status)) return false;
    return new Date(b.startDateTime) > new Date();
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return ['pending', 'approved'].includes(b.status) && new Date(b.startDateTime) > new Date();
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled' || b.status === 'rejected';
    }
    return true;
  });

  const totalCount = bookings.length;
  const activeCount = bookings.filter(
    (b) => ['pending', 'approved'].includes(b.status) && new Date(b.startDateTime) > new Date()
  ).length;

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Reservations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, review, or cancel your workspace reservations.
          </p>
        </div>

        <Link
          to="/spaces"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reservations
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming / Active
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cancelled / History
            </div>
            <div className="text-2xl font-extrabold text-slate-500 mt-1">
              {totalCount - activeCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Ban className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1.5 rounded-xl w-fit shadow-2xs">
        {[
          { id: 'all', label: 'All Bookings' },
          { id: 'upcoming', label: 'Active & Upcoming' },
          { id: 'cancelled', label: 'Cancelled / History' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">No reservations found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't booked any workspace in this category yet.
            </p>
          </div>
          <Link
            to="/spaces"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            <span>Browse Available Spaces</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{b.space?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
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

                {canCancel(b) && (
                  <button
                    type="button"
                    onClick={() => setCancelId(b._id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this booking reservation? This action cannot be undone."
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        loading={cancelLoading}
      />
    </div>
  );
}
