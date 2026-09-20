const Booking = require('../models/Booking');
const MaintenanceWindow = require('../models/MaintenanceWindow');
const Space = require('../models/Space');
const AppError = require('../utils/AppError');
const { getDayBounds, formatTime, parseDate } = require('../utils/dateTime');

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const SLOT_MINUTES = 60;

const generateSlots = (dayStart) => {
  const slots = [];
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour += 1) {
    const start = new Date(dayStart);
    start.setUTCHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setUTCMinutes(end.getUTCMinutes() + SLOT_MINUTES);
    slots.push({ start, end });
  }
  return slots;
};

const getSlotStatus = (slotStart, slotEnd, bookings, maintenanceWindows) => {
  const maint = maintenanceWindows.find(
    (m) => m.startDateTime < slotEnd && m.endDateTime > slotStart
  );
  if (maint) {
    return { status: 'maintenance', reason: maint.reason || 'Maintenance' };
  }

  const booking = bookings.find(
    (b) => b.startDateTime < slotEnd && b.endDateTime > slotStart
  );
  if (booking) {
    return { status: booking.status };
  }

  return { status: 'available' };
};

const getAvailability = async (spaceId, dateStr) => {
  const space = await Space.findById(spaceId);
  if (!space || space.status === 'inactive') {
    throw new AppError('Space not found', 404, 'NOT_FOUND');
  }

  parseDate(dateStr);
  const { dayStart, dayEnd } = getDayBounds(dateStr);

  const [bookings, maintenanceWindows] = await Promise.all([
    Booking.find({
      space: spaceId,
      status: { $in: ['pending', 'approved'] },
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart },
    }).select('startDateTime endDateTime status'),
    MaintenanceWindow.find({
      space: spaceId,
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart },
    }).select('startDateTime endDateTime reason'),
  ]);

  const slots = generateSlots(dayStart).map(({ start, end }) => {
    const { status, reason } = getSlotStatus(start, end, bookings, maintenanceWindows);
    return {
      start: formatTime(start),
      end: formatTime(end),
      status,
      ...(reason ? { reason } : {}),
    };
  });

  return { date: dateStr, space: { id: space._id, name: space.name, type: space.type }, slots };
};

module.exports = { getAvailability };
