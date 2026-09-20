const bookingService = require('../services/bookingService');
const asyncHandler = require('../utils/asyncHandler');

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user._id, req.body);
  res.status(201).json({ success: true, data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user._id);
  res.json({ success: true, data: bookings });
});

const getBooking = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const booking = await bookingService.getBookingById(req.params.id, req.user._id, isAdmin);
  res.json({ success: true, data: booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user._id);
  res.json({ success: true, data: booking, message: 'Booking cancelled' });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const { status, space, date } = req.query;
  const bookings = await bookingService.getAllBookings({ status, space, date });
  res.json({ success: true, data: bookings });
});

const approveBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.approveBooking(req.params.id);
  res.json({ success: true, data: booking, message: 'Booking approved' });
});

const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.rejectBooking(req.params.id);
  res.json({ success: true, data: booking, message: 'Booking rejected' });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
};
