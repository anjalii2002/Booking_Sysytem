import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Toggle from '../../components/Toggle';
import {
  Building2,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  Sliders,
} from 'lucide-react';

export default function AdminSpaceForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    type: 'desk',
    capacity: 1,
    amenities: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      spacesApi.get(id).then(({ data }) => {
        const s = data.data;
        setForm({
          name: s.name,
          type: s.type,
          capacity: s.capacity,
          amenities: s.amenities?.join(', ') || '',
          description: s.description || '',
          status: s.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      capacity: parseInt(form.capacity, 10),
      amenities: form.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };
    try {
      if (isEdit) await spacesApi.update(id, payload);
      else await spacesApi.create(payload);
      showToast(isEdit ? 'Space updated successfully' : 'Space created successfully');
      navigate('/admin/spaces');
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isStatusActive = form.status === 'active';

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in pb-12">
      {/* Back & Title */}
      <div>
        <Link
          to="/admin/spaces"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Space Inventory</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {isEdit ? 'Edit Space Details' : 'Add New Space'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure workspace specifications, capacity, and amenities.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Details */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">General Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">Space Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Executive Desk 04 or Conference Room Alpha"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Space Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
              >
                <option value="desk">Individual Desk</option>
                <option value="meeting_room">Meeting Room</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Capacity (Persons)</label>
              <input
                type="number"
                min="1"
                required
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Amenities & Specs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Amenities & Description</h3>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                placeholder="4K Monitor, Ergonomic Chair, Whiteboard, Video Conference"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
              />
              {/* Chips Preview */}
              {form.amenities && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {form.amenities
                    .split(',')
                    .map((a) => a.trim())
                    .filter(Boolean)
                    .map((chip, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-medium bg-teal-50 text-teal-800 rounded-md border border-teal-100"
                      >
                        {chip}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide details about the space, room location, or equipment provided..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status Toggle Switch Control */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Space Status Control</h3>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <Toggle
              label={isStatusActive ? 'Status: Active & Searchable' : 'Status: Inactive / Hidden'}
              description={
                isStatusActive
                  ? 'Members can discover and reserve this workspace.'
                  : 'This space is hidden from member availability searches.'
              }
              enabled={isStatusActive}
              onChange={(newVal) =>
                setForm({ ...form, status: newVal ? 'active' : 'inactive' })
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl disabled:opacity-50 transition-colors shadow-xs flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Space</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/spaces')}
            className="px-5 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
