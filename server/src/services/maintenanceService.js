const MaintenanceWindow = require('../models/MaintenanceWindow');
const Space = require('../models/Space');
const AppError = require('../utils/AppError');

const createMaintenance = async (adminId, { space, startDateTime, endDateTime, reason }) => {
  const spaceDoc = await Space.findById(space);
  if (!spaceDoc) throw new AppError('Space not found', 404, 'NOT_FOUND');

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  if (end <= start) {
    throw new AppError('End must be after start', 400, 'INVALID_TIME_RANGE');
  }

  return MaintenanceWindow.create({
    space,
    startDateTime: start,
    endDateTime: end,
    reason: reason || '',
    createdBy: adminId,
  });
};

const listMaintenance = async () =>
  MaintenanceWindow.find()
    .populate('space', 'name type')
    .populate('createdBy', 'name email')
    .sort({ startDateTime: -1 });

const deleteMaintenance = async (id) => {
  const doc = await MaintenanceWindow.findByIdAndDelete(id);
  if (!doc) throw new AppError('Maintenance window not found', 404, 'NOT_FOUND');
  return doc;
};

module.exports = { createMaintenance, listMaintenance, deleteMaintenance };
