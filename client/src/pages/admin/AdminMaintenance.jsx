import { useState, useEffect } from 'react';
import { adminApi, spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import SkeletonLoader from '../../components/SkeletonLoader';
import {
  Wrench,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export default function AdminMaintenance() {
  const [windows, setWindows] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({
    space: '',
    startDateTime: '',
    endDateTime: '',
    reason: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const fetchData = () => {
    Promise.all([adminApi.maintenance.list(), spacesApi.list({ limit: 100 })])
      .then(([maint, sp]) => {
        setWindows(maint.data.data);
        setSpaces(sp.data.data.spaces);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await adminApi.maintenance.create(form);
      showToast('Maintenance window created');
      setForm({ space: '', startDateTime: '', endDateTime: '', reason: '' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.maintenance.delete(deleteId);
      showToast('Maintenance window removed');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Maintenance Scheduler
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Block spaces out for scheduled repairs, cleaning, or administrative hold.
          </p>
        </div>

        <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
          Active Windows: <span className="font-bold text-rose-900">{windows.length} blocked</span>
        </div>
      </div>

      {/* Creation Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wrench className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Add Maintenance Window</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Target Space</label>
            <select
              required
              value={form.space}
              onChange={(e) => setForm({ ...form, space: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            >
              <option value="">Select a space...</option>
              {spaces.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.type.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Maintenance Reason</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. AC repair, Deep cleaning, Network upgrade"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Start Date & Time</label>
            <input
              type="datetime-local"
              required
              value={form.startDateTime}
              onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">End Date & Time</label>
            <input
              type="datetime-local"
              required
              value={form.endDateTime}
              onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl disabled:opacity-50 transition-colors shadow-2xs flex items-center gap-1.5"
        >
          {submitLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Schedule Maintenance</span>
            </>
          )}
        </button>
      </form>

      {/* Scheduled Windows List */}
      {loading ? (
        <SkeletonLoader type="table" count={3} />
      ) : windows.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No active maintenance windows</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            All spaces are currently operational and available for booking.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {windows.map((w) => (
            <div
              key={w._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-200">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{w.space?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(w.startDateTime).toLocaleString()} -{' '}
                      {new Date(w.endDateTime).toLocaleString()}
                    </span>
                    {w.reason && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-50 text-rose-700 rounded-md border border-rose-100">
                        {w.reason}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteId(w._id)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 self-end sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Window</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Remove Maintenance Window"
        message="Are you sure you want to remove this maintenance blackout period? The space will become available again for member reservations."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
