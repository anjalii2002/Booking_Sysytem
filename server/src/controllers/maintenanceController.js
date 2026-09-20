const maintenanceService = require('../services/maintenanceService');
const asyncHandler = require('../utils/asyncHandler');

const createMaintenance = asyncHandler(async (req, res) => {
  const doc = await maintenanceService.createMaintenance(req.user._id, req.body);
  res.status(201).json({ success: true, data: doc });
});

const listMaintenance = asyncHandler(async (req, res) => {
  const docs = await maintenanceService.listMaintenance();
  res.json({ success: true, data: docs });
});

const deleteMaintenance = asyncHandler(async (req, res) => {
  const doc = await maintenanceService.deleteMaintenance(req.params.id);
  res.json({ success: true, data: doc, message: 'Maintenance window removed' });
});

module.exports = { createMaintenance, listMaintenance, deleteMaintenance };
