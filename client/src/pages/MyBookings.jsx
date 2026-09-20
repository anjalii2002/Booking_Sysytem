import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { showToast } = useToast();

  const fetchBookings = () => {
    setLoading(true);
    bookingsApi.my()
      .then(({ data }) => setBookings(data.data))
      .catch(() => showToast('Failed to load bookings', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

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

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet.</p>
          <Link to="/spaces" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Spaces</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{b.space?.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {b.date} · {b.startTime} - {b.endTime}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusBadge status={b.status} />
                {canCancel(b) && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setCancelId(b._id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        loading={cancelLoading}
      />
    </div>
  );
}
