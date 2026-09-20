const { body, param } = require('express-validator');

const createMaintenanceValidator = [
  body('space').isMongoId().withMessage('Valid space ID is required'),
  body('startDateTime').isISO8601().withMessage('Valid startDateTime is required'),
  body('endDateTime').isISO8601().withMessage('Valid endDateTime is required'),
  body('reason').optional().isString(),
];

const maintenanceIdValidator = [
  param('id').isMongoId().withMessage('Invalid maintenance ID'),
];

module.exports = { createMaintenanceValidator, maintenanceIdValidator };
