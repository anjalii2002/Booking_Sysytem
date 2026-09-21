import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader from '../../components/SkeletonLoader';
import { Clock, Check, X, User, Calendar, Loader2 } from 'lucide-react';

export default function AdminApprovals() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const { showToast } = useToast();

  const fetchPending = () => {
    setLoading(true);
    adminApi
      .bookings({ status: 'pending' })
      .then(({ data }) => setBookings(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    setActionId(id);
    try {
      if (action === 'approve') await adminApi.approve(id);
      else await adminApi.reject(id);
      showToast(`Booking ${action}d successfully`);
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pending Approvals Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and grant or reject pending member booking requests.
          </p>
        </div>

        <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
          Pending: <span className="font-bold text-amber-900">{bookings.length} requests</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Queue is completely empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            All pending member booking requests have been reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center uppercase flex-shrink-0 mt-0.5">
                  {b.user?.name ? b.user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{b.space?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {b.user?.name}
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

              <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                <StatusBadge status={b.status} />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={actionId === b._id}
                    onClick={() => handleAction(b._id, 'approve')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-colors shadow-2xs flex items-center gap-1"
                  >
                    {actionId === b._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionId === b._id}
                    onClick={() => handleAction(b._id, 'reject')}
                    className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    {actionId === b._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
