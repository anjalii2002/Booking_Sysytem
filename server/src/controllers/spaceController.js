const spaceService = require('../services/spaceService');
const availabilityService = require('../services/availabilityService');
const asyncHandler = require('../utils/asyncHandler');

const listSpaces = asyncHandler(async (req, res) => {
  const { page, limit, type, capacity, search, date } = req.query;
  const result = await spaceService.listSpaces({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    type,
    capacity,
    search,
    date,
  });
  res.json({ success: true, data: result });
});

const getSpace = asyncHandler(async (req, res) => {
  const space = await spaceService.getSpaceById(req.params.id);
  res.json({ success: true, data: space });
});

const createSpace = asyncHandler(async (req, res) => {
  const space = await spaceService.createSpace(req.body);
  res.status(201).json({ success: true, data: space });
});

const updateSpace = asyncHandler(async (req, res) => {
  const space = await spaceService.updateSpace(req.params.id, req.body);
  res.json({ success: true, data: space });
});

const deleteSpace = asyncHandler(async (req, res) => {
  const space = await spaceService.deleteSpace(req.params.id);
  res.json({ success: true, data: space });
});

const getAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const availability = await availabilityService.getAvailability(req.params.id, date);
  res.json({ success: true, data: availability });
});

module.exports = { listSpaces, getSpace, createSpace, updateSpace, deleteSpace, getAvailability };
