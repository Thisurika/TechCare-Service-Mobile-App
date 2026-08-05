const express = require('express');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All notification routes are protected
router.use(protect);

// @route   GET /api/notifications
router.get('/', getNotifications);

// @route   PUT /api/notifications/read-all
router.put('/read-all', markAllAsRead);

// @route   PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

module.exports = router;
