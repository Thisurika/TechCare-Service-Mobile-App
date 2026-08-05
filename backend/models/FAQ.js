const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    category: {
      type: String,
      enum: ['general', 'booking', 'payment', 'repair', 'tips'],
      default: 'general',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
