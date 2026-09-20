const Space = require('../models/Space');
const Booking = require('../models/Booking');
const MaintenanceWindow = require('../models/MaintenanceWindow');
const AppError = require('../utils/AppError');
const { getDayBounds } = require('../utils/dateTime');

const listSpaces = async ({ page = 1, limit = 10, type, capacity, search, date }) => {
  const query = { status: 'active' };

  if (type) query.type = type;
  if (capacity) query.capacity = { $gte: parseInt(capacity, 10) };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },
    ];
  }

  let spaceIds = null;
  if (date) {
    const { dayStart, dayEnd } = getDayBounds(date);
    const busySpaceIds = await Booking.distinct('space', {
      status: { $in: ['pending', 'approved'] },
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart },
    });
    const maintSpaceIds = await MaintenanceWindow.distinct('space', {
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart },
    });
    const unavailable = new Set([...busySpaceIds.map(String), ...maintSpaceIds.map(String)]);
    const allSpaces = await Space.find({ status: 'active' }).select('_id');
    spaceIds = allSpaces
      .map((s) => s._id.toString())
      .filter((id) => !unavailable.has(id));
    query._id = { $in: spaceIds };
  }

  const skip = (page - 1) * limit;
  const [spaces, total] = await Promise.all([
    Space.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Space.countDocuments(query),
  ]);

  return {
    spaces,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getSpaceById = async (id) => {
  const space = await Space.findById(id);
  if (!space || space.status === 'inactive') {
    throw new AppError('Space not found', 404, 'NOT_FOUND');
  }
  return space;
};

const createSpace = async (data) => Space.create(data);

const updateSpace = async (id, data) => {
  const space = await Space.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!space) throw new AppError('Space not found', 404, 'NOT_FOUND');
  return space;
};

const deleteSpace = async (id) => {
  const space = await Space.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  if (!space) throw new AppError('Space not found', 404, 'NOT_FOUND');
  return space;
};

module.exports = { listSpaces, getSpaceById, createSpace, updateSpace, deleteSpace };
