const express = require('express');
const bookingController = require('../controllers/bookingController');
const maintenanceController = require('../controllers/maintenanceController');
const { bookingIdValidator } = require('../validators/bookingValidator');
const { createMaintenanceValidator, maintenanceIdValidator } = require('../validators/maintenanceValidator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/bookings', bookingController.getAllBookings);
router.patch('/bookings/:id/approve', bookingIdValidator, validate, bookingController.approveBooking);
router.patch('/bookings/:id/reject', bookingIdValidator, validate, bookingController.rejectBooking);

router.post('/maintenance', createMaintenanceValidator, validate, maintenanceController.createMaintenance);
router.get('/maintenance', maintenanceController.listMaintenance);
router.delete('/maintenance/:id', maintenanceIdValidator, validate, maintenanceController.deleteMaintenance);

module.exports = router;
