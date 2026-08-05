const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    deviceBrand: {
      type: String,
      required: [true, 'Device brand is required'],
      trim: true,
    },
    deviceModel: {
      type: String,
      required: [true, 'Device model is required'],
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, 'Issue description is required'],
      minlength: 10,
    },
    photos: [
      {
        type: String, // File paths
      },
    ],
    serviceMethod: {
      type: String,
      required: true,
      enum: ['pickup', 'drop-off'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Scheduled time is required'],
    },
    status: {
      type: String,
      enum: ['received', 'confirmed', 'assigned', 'picked-up', 'under-repair', 'ready', 'completed', 'cancelled'],
      default: 'received',
    },
    technicianName: {
      type: String,
      default: '',
    },
    estimatedCompletion: {
      type: Date,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    trackingHistory: [
      {
        status: {
          type: String,
          enum: ['received', 'confirmed', 'assigned', 'picked-up', 'under-repair', 'ready', 'completed', 'cancelled'],
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

// Add initial tracking history on creation
bookingSchema.pre('save', function (next) {
  if (this.isNew) {
    this.trackingHistory.push({
      status: 'received',
      message: 'Your repair request has been received. We will review and confirm shortly.',
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
