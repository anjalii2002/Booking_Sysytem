const { body, param } = require('express-validator');
const { DATE_REGEX, TIME_REGEX } = require('../utils/dateTime');

const createBookingValidator = [
  body('space').isMongoId().withMessage('Valid space ID is required'),
  body('date').matches(DATE_REGEX).withMessage('Date must be YYYY-MM-DD'),
  body('startTime').matches(TIME_REGEX).withMessage('Start time must be HH:mm'),
  body('endTime').matches(TIME_REGEX).withMessage('End time must be HH:mm'),
];

const bookingIdValidator = [
  param('id').isMongoId().withMessage('Invalid booking ID'),
];

module.exports = { createBookingValidator, bookingIdValidator };
