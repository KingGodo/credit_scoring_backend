const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, getMe,
  updateUser, activateUser, deactivateUser,
  updatePassword, deleteUser,
} = require('./users.controller');
const { validateUpdateUser, validateChangePassword } = require('./users.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/users/me  — logged in user sees their own profile
router.get('/me', authenticate, getMe);

// GET /api/users  — admin only
router.get('/', authenticate, authorize('admin'), getAllUsers);

// GET /api/users/:id  — admin only
router.get('/:id', authenticate, authorize('admin'), getUserById);

// PUT /api/users/:id  — admin only
router.put('/:id', authenticate, authorize('admin'), validateUpdateUser, updateUser);

// PATCH /api/users/:id/activate  — admin only
router.patch('/:id/activate', authenticate, authorize('admin'), activateUser);

// PATCH /api/users/:id/deactivate  — admin only
router.patch('/:id/deactivate', authenticate, authorize('admin'), deactivateUser);

// PATCH /api/users/change-password  — any logged in user
router.patch('/change-password', authenticate, validateChangePassword, updatePassword);

// DELETE /api/users/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;