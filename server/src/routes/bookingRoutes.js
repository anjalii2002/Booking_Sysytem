const express = require('express');
const bookingController = require('../controllers/bookingController');
const { createBookingValidator, bookingIdValidator } = require('../validators/bookingValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', createBookingValidator, validate, bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);
router.get('/:id', bookingIdValidator, validate, bookingController.getBooking);
router.patch('/:id/cancel', bookingIdValidator, validate, bookingController.cancelBooking);

module.exports = router;
