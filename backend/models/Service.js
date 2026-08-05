const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['smartphone', 'laptop', 'television', 'air-conditioner', 'refrigerator', 'washing-machine'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    estimatedPrice: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    estimatedDuration: {
      type: String, // e.g., "1-2 hours", "2-3 days"
      required: true,
    },
    icon: {
      type: String,
      default: 'build', // MaterialIcons name
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient category filtering
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
