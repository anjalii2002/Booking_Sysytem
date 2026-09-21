import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import SkeletonLoader from '../../components/SkeletonLoader';
import StatusBadge from '../../components/StatusBadge';
import { Building2, Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  const fetchSpaces = () => {
    spacesApi
      .list({ limit: 100 })
      .then(({ data }) => setSpaces(data.data.spaces))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await spacesApi.delete(deleteId);
      showToast('Space deactivated');
      setDeleteId(null);
      fetchSpaces();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Manage Spaces
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Total Inventory: <span className="font-semibold text-slate-800">{spaces.length} spaces</span>
          </p>
        </div>

        <Link
          to="/admin/spaces/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Space</span>
        </Link>
      </div>

      {/* Grid List */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : spaces.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No spaces created yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Click below to create your first desk or meeting room.
          </p>
          <Link
            to="/admin/spaces/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Space</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((s) => (
            <div
              key={s._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{s.name}</h3>
                  <StatusBadge status={s.status || 'active'} showIcon={false} />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {s.type.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Capacity: {s.capacity}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {s.description || 'No description set.'}
                </p>

                {s.amenities && s.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {s.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <Link
                  to={`/admin/spaces/${s._id}/edit`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteId(s._id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Deactivate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate Space"
        message="This action will deactivate the space from availability searches. Existing booking logs will be preserved."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
