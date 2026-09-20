import { useState, useEffect } from 'react';
import { adminApi, spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminMaintenance() {
  const [windows, setWindows] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({ space: '', startDateTime: '', endDateTime: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const fetchData = () => {
    Promise.all([
      adminApi.maintenance.list(),
      spacesApi.list({ limit: 100 }),
    ]).then(([maint, sp]) => {
      setWindows(maint.data.data);
      setSpaces(sp.data.data.spaces);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Maintenance Windows</h1>
        <p>Block spaces for maintenance periods</p>
      </div>

      <form className="card" style={{ marginBottom: '2rem' }} onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem' }}>Add Maintenance Window</h3>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Space</label>
            <select required value={form.space} onChange={(e) => setForm({ ...form, space: e.target.value })}>
              <option value="">Select space</option>
              {spaces.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="AC repair" />
          </div>
          <div className="form-group">
            <label>Start</label>
            <input type="datetime-local" required value={form.startDateTime} onChange={(e) => setForm({ ...form, startDateTime: e.target.value })} />
          </div>
          <div className="form-group">
            <label>End</label>
            <input type="datetime-local" required value={form.endDateTime} onChange={(e) => setForm({ ...form, endDateTime: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
          {submitLoading ? 'Creating...' : 'Add Window'}
        </button>
      </form>

      {windows.length === 0 ? (
        <div className="empty-state">No maintenance windows scheduled.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {windows.map((w) => (
            <div key={w._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{w.space?.name}</strong>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {new Date(w.startDateTime).toLocaleString()} - {new Date(w.endDateTime).toLocaleString()}
                  {w.reason && ` · ${w.reason}`}
                </p>
              </div>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleteId(w._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Maintenance"
        message="Remove this maintenance window?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
