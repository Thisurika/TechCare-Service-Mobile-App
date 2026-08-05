const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes are protected
router.use(protect);

// @route   POST /api/bookings
router.post('/', createBooking);

// @route   GET /api/bookings
router.get('/', getUserBookings);

// @route   GET /api/bookings/:id
router.get('/:id', getBookingById);

// @route   PUT /api/bookings/:id/status
router.put('/:id/status', updateBookingStatus);

// @route   DELETE /api/bookings/:id
router.delete('/:id', cancelBooking);

module.exports = router;
