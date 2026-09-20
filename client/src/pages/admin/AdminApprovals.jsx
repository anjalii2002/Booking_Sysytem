import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';

export default function AdminApprovals() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const { showToast } = useToast();

  const fetchPending = () => {
    setLoading(true);
    adminApi.bookings({ status: 'pending' })
      .then(({ data }) => setBookings(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action) => {
    setActionId(id);
    try {
      if (action === 'approve') await adminApi.approve(id);
      else await adminApi.reject(id);
      showToast(`Booking ${action}d`);
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Approval Queue</h1>
        <p>{bookings.length} pending requests</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">No pending bookings to review.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookings.map((b) => (
            <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong>{b.space?.name}</strong>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {b.user?.name} · {b.date} {b.startTime}-{b.endTime}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <StatusBadge status={b.status} />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={actionId === b._id}
                  onClick={() => handleAction(b._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={actionId === b._id}
                  onClick={() => handleAction(b._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
