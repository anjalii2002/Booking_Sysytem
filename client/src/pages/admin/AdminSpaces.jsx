import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spacesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  const fetchSpaces = () => {
    spacesApi.list({ limit: 100 })
      .then(({ data }) => setSpaces(data.data.spaces))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSpaces(); }, []);

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Manage Spaces</h1>
          <p style={{ color: '#6b7280' }}>{spaces.length} spaces</p>
        </div>
        <Link to="/admin/spaces/new" className="btn btn-primary">Add Space</Link>
      </div>

      <div className="grid grid-2">
        {spaces.map((s) => (
          <div key={s._id} className="card">
            <h3>{s.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0' }}>
              {s.type.replace('_', ' ')} · Capacity {s.capacity}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Link to={`/admin/spaces/${s._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleteId(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Space"
        message="This will deactivate the space. Existing bookings are preserved."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
