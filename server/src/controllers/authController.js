const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  res.json({
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = { register, login, refresh, logout };
