import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { spacesApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  Check,
} from 'lucide-react';

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
    spacesApi
      .get(id)
      .then(({ data }) => setSpace(data.data))
      .catch(() => showToast('Space not found', 'error'));
  }, [id]);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    spacesApi
      .availability(id, date)
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

  if (!space) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          <span>Loading space details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/spaces"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Spaces</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {space.type.replace('_', ' ')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Capacity: {space.capacity}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {space.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Amenities */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overview Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>About Workspace</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {space.description || 'No specific description provided for this space.'}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Included Amenities</span>
            </h3>

            {space.amenities && space.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {space.amenities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standard desk setup provided.</p>
            )}
          </div>

          {/* Booking Guidelines */}
          <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <span>Reservation Rules</span>
            </div>
            <p>• Bookings are confirmed on slot approval by space administrator.</p>
            <p>• Cancellations must be performed prior to the reservation start time.</p>
          </div>
        </div>

        {/* Right Column: Availability & Booking Slot Widget */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Select Date & Time Slot</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick an available hourly slot for your reservation.
                </p>
              </div>

              {/* Date Input */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-800"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-teal-600" />
                <span className="text-slate-900 font-semibold">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300" />
                <span>Booked / Maint</span>
              </div>
            </div>

            {/* Slot Selector Grid */}
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Checking live slot status...</span>
              </div>
            ) : availability?.slots?.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No slots configured for this date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availability?.slots?.map((slot) => {
                  const isAvailable = slot.status === 'available';
                  const isSelected = selectedSlot?.start === slot.start;

                  let slotStyle =
                    'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60';

                  if (isSelected) {
                    slotStyle =
                      'border-2 border-teal-600 bg-teal-600 text-white font-bold shadow-sm scale-102';
                  } else if (isAvailable) {
                    slotStyle =
                      'border border-emerald-300 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100 cursor-pointer font-semibold';
                  } else if (slot.status === 'pending') {
                    slotStyle =
                      'border border-amber-200 bg-amber-50 text-amber-700 cursor-not-allowed';
                  } else if (slot.status === 'approved') {
                    slotStyle =
                      'border border-rose-200 bg-rose-50 text-rose-700 cursor-not-allowed';
                  } else if (slot.status === 'maintenance') {
                    slotStyle =
                      'border border-rose-200 bg-rose-100 text-rose-800 cursor-not-allowed';
                  }

                  return (
                    <button
                      key={slot.start}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-center transition-all flex flex-col items-center justify-center ${slotStyle}`}
                    >
                      <span className="text-xs tracking-tight">
                        {slot.start} - {slot.end}
                      </span>
                      <span className="text-[10px] uppercase font-bold mt-1 tracking-wider opacity-80">
                        {slot.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Slot Summary Bar & Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs">
                {selectedSlot ? (
                  <span className="text-slate-900 font-medium">
                    Selected Slot:{' '}
                    <strong className="text-teal-700 font-bold">
                      {selectedSlot.start} - {selectedSlot.end}
                    </strong>{' '}
                    on <strong>{date}</strong>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Click any available slot above to proceed.
                  </span>
                )}
              </div>

              {user ? (
                <button
                  type="button"
                  disabled={!selectedSlot || bookingLoading}
                  onClick={handleBook}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-xs text-slate-500">
                  Please{' '}
                  <Link to="/login" className="text-teal-700 font-semibold hover:underline">
                    Login
                  </Link>{' '}
                  to reserve this space.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
