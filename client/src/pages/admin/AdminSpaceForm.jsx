import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminSpaceForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '', type: 'desk', capacity: 1, amenities: '', description: '', status: 'active',
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
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
    };
    try {
      if (isEdit) await spacesApi.update(id, payload);
      else await spacesApi.create(payload);
      showToast(isEdit ? 'Space updated' : 'Space created');
      navigate('/admin/spaces');
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit Space' : 'Add Space'}</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="desk">Desk</option>
            <option value="meeting_room">Meeting Room</option>
          </select>
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <input type="number" min="1" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Amenities (comma-separated)</label>
          <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Monitor, Whiteboard" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/spaces')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
