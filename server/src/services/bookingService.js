const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Space = require('../models/Space');
const MaintenanceWindow = require('../models/MaintenanceWindow');
const AppError = require('../utils/AppError');
const { buildBookingDateTimes } = require('../utils/dateTime');

const BLOCKING_STATUSES = ['pending', 'approved'];

const overlapFilter = (spaceId, startDateTime, endDateTime, excludeId = null) => {
  const filter = {
    space: spaceId,
    status: { $in: BLOCKING_STATUSES },
    startDateTime: { $lt: endDateTime },
    endDateTime: { $gt: startDateTime },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return filter;
};

const maintenanceOverlapFilter = (spaceId, startDateTime, endDateTime) => ({
  space: spaceId,
  startDateTime: { $lt: endDateTime },
  endDateTime: { $gt: startDateTime },
});

const createBooking = async (userId, { space: spaceId, date, startTime, endTime }) => {
  const session = await mongoose.startSession();

  try {
    let booking;
    await session.withTransaction(async () => {
      const space = await Space.findOne({ _id: spaceId, status: 'active' }).session(session);
      if (!space) {
        throw new AppError('Space not found or inactive', 404, 'SPACE_NOT_FOUND');
      }

      const { startDateTime, endDateTime } = buildBookingDateTimes(date, startTime, endTime);

      // Updating the space makes concurrent booking attempts for it contend in the transaction.
      await Space.findByIdAndUpdate(spaceId, { $inc: { __v: 1 } }).session(session);

      const conflict = await Booking.findOne(
        overlapFilter(spaceId, startDateTime, endDateTime)
      ).session(session);
      if (conflict) {
        throw new AppError('Booking slot is already unavailable', 409, 'BOOKING_CONFLICT');
      }

      const maintenance = await MaintenanceWindow.findOne(
        maintenanceOverlapFilter(spaceId, startDateTime, endDateTime)
      ).session(session);
      if (maintenance) {
        throw new AppError('Space is under maintenance for this time slot', 409, 'MAINTENANCE_CONFLICT');
      }

      [booking] = await Booking.create(
        [{ user: userId, space: spaceId, date, startTime, endTime, startDateTime, endDateTime, status: 'pending' }],
        { session }
      );
    });
    // Populate before ending the session because the document retains its transaction session.
    return await booking.populate(['space', 'user']);
  } finally {
    session.endSession();
  }
};

const getMyBookings = async (userId) =>
  Booking.find({ user: userId })
    .populate('space', 'name type capacity')
    .sort({ startDateTime: -1 });

const getBookingById = async (bookingId, userId, isAdmin = false) => {
  const booking = await Booking.findById(bookingId).populate('space', 'name type capacity').populate('user', 'name email');
  if (!booking) throw new AppError('Booking not found', 404, 'NOT_FOUND');
  if (!isAdmin && booking.user._id.toString() !== userId.toString()) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
  return booking;
};

const cancelBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404, 'NOT_FOUND');
  if (booking.user.toString() !== userId.toString()) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
  if (!['pending', 'approved'].includes(booking.status)) {
    throw new AppError('Only pending or approved bookings can be cancelled', 400, 'INVALID_STATUS');
  }
  if (booking.startDateTime <= new Date()) {
    throw new AppError('Cannot cancel past bookings', 400, 'PAST_BOOKING');
  }

  booking.status = 'cancelled';
  await booking.save();
  return booking.populate('space', 'name type capacity');
};

const getAllBookings = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.space) query.space = filters.space;
  if (filters.date) {
    query.date = filters.date;
  }

  return Booking.find(query)
    .populate('space', 'name type')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

const approveBooking = async (bookingId) => {
  const session = await mongoose.startSession();

  try {
    let booking;
    await session.withTransaction(async () => {
      booking = await Booking.findById(bookingId).session(session);
      if (!booking) throw new AppError('Booking not found', 404, 'NOT_FOUND');
      if (booking.status !== 'pending') {
        throw new AppError('Only pending bookings can be approved', 400, 'INVALID_STATUS');
      }

      await Space.findByIdAndUpdate(booking.space, { $inc: { __v: 1 } }).session(session);

      const existingApproved = await Booking.findOne({
        space: booking.space,
        status: 'approved',
        startDateTime: { $lt: booking.endDateTime },
        endDateTime: { $gt: booking.startDateTime },
        _id: { $ne: booking._id },
      }).session(session);
      if (existingApproved) {
        throw new AppError('An approved booking already exists for this slot', 409, 'BOOKING_CONFLICT');
      }

      booking.status = 'approved';
      await booking.save({ session });
      await Booking.updateMany(
        {
          space: booking.space,
          status: 'pending',
          _id: { $ne: booking._id },
          startDateTime: { $lt: booking.endDateTime },
          endDateTime: { $gt: booking.startDateTime },
        },
        { status: 'rejected' },
        { session }
      );
    });
    // Populate before ending the session because the document retains its transaction session.
    return await booking.populate(['space', 'user']);
  } finally {
    session.endSession();
  }
};

const rejectBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404, 'NOT_FOUND');
  if (booking.status !== 'pending') {
    throw new AppError('Only pending bookings can be rejected', 400, 'INVALID_STATUS');
  }
  booking.status = 'rejected';
  await booking.save();
  return booking.populate(['space', 'user']);
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
  overlapFilter,
};
