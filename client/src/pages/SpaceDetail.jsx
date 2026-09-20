import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spacesApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export default function SpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [space, setSpace] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [date, setDate] = useState(tomorrow());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    spacesApi.get(id).then(({ data }) => setSpace(data.data)).catch(() => showToast('Space not found', 'error'));
  }, [id]);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    spacesApi.availability(id, date)
      .then(({ data }) => setAvailability(data.data))
      .catch(() => showToast('Failed to load availability', 'error'))
      .finally(() => setLoading(false));
  }, [id, date]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedSlot) {
      showToast('Please select a time slot', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingsApi.create({
        space: id,
        date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      });
      showToast('Booking request submitted!');
      setSelectedSlot(null);
      const { data } = await spacesApi.availability(id, date);
      setAvailability(data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!space) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>{space.name}</h1>
        <p>{space.type.replace('_', ' ')} · Capacity {space.capacity}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Details</h3>
          <p style={{ marginBottom: '1rem', color: '#374151' }}>{space.description}</p>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Amenities</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {space.amenities?.map((a) => (
              <span key={a} className="badge badge-cancelled">{a}</span>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Availability</h3>
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} />
          </div>

          {loading ? (
            <div className="loading">Loading availability...</div>
          ) : (
            <>
              <div className="slot-grid" style={{ marginBottom: '1.5rem' }}>
                {availability?.slots?.map((slot) => {
                  const isAvailable = slot.status === 'available';
                  const isSelected = selectedSlot?.start === slot.start;
                  let className = 'slot ';
                  if (isSelected) className += 'slot-selected';
                  else if (isAvailable) className += 'slot-available';
                  else if (slot.status === 'pending') className += 'slot-pending slot-unavailable';
                  else if (slot.status === 'approved') className += 'slot-approved slot-unavailable';
                  else if (slot.status === 'maintenance') className += 'slot-maintenance slot-unavailable';
                  else className += 'slot-unavailable';

                  return (
                    <div
                      key={slot.start}
                      className={className}
                      onClick={() => isAvailable && setSelectedSlot(slot)}
                      title={slot.reason || slot.status}
                    >
                      <div>{slot.start} - {slot.end}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                        {slot.status}
                      </div>
                    </div>
                  );
                })}
              </div>

              {user ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!selectedSlot || bookingLoading}
                  onClick={handleBook}
                >
                  {bookingLoading ? 'Booking...' : selectedSlot ? `Book ${selectedSlot.start} - ${selectedSlot.end}` : 'Select a slot to book'}
                </button>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <a href="/login">Login</a> to book this space.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
