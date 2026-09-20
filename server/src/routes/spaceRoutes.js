const express = require('express');
const spaceController = require('../controllers/spaceController');
const { createSpaceValidator, updateSpaceValidator, spaceIdValidator } = require('../validators/spaceValidator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', spaceController.listSpaces);
router.get('/:id/availability', spaceIdValidator, validate, spaceController.getAvailability);
router.get('/:id', spaceIdValidator, validate, spaceController.getSpace);
router.post('/', authenticate, authorize('admin'), createSpaceValidator, validate, spaceController.createSpace);
router.put('/:id', authenticate, authorize('admin'), updateSpaceValidator, validate, spaceController.updateSpace);
router.delete('/:id', authenticate, authorize('admin'), spaceIdValidator, validate, spaceController.deleteSpace);

module.exports = router;
