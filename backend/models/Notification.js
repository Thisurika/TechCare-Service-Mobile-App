const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    type: {
      type: String,
      enum: ['booking', 'status', 'promo', 'system'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user notification queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
