const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  getAllBookings,
  getBookingById,
  updateBooking,
  getAdminServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes are protected + admin-only
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Bookings management
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id', updateBooking);

// Services management
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router;
