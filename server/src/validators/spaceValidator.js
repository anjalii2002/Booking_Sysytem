const { body, param } = require('express-validator');

const createSpaceValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('type').isIn(['desk', 'meeting_room']).withMessage('Type must be desk or meeting_room'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('description').optional().isString(),
  body('status').optional().isIn(['active', 'inactive']),
];

const updateSpaceValidator = [
  param('id').isMongoId().withMessage('Invalid space ID'),
  body('name').optional().trim().notEmpty(),
  body('type').optional().isIn(['desk', 'meeting_room']),
  body('capacity').optional().isInt({ min: 1 }),
  body('amenities').optional().isArray(),
  body('description').optional().isString(),
  body('status').optional().isIn(['active', 'inactive']),
];

const spaceIdValidator = [
  param('id').isMongoId().withMessage('Invalid space ID'),
];

module.exports = { createSpaceValidator, updateSpaceValidator, spaceIdValidator };
