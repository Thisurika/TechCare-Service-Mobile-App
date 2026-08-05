const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      service,
      deviceBrand,
      deviceModel,
      issueDescription,
      photos,
      serviceMethod,
      address,
      scheduledDate,
      scheduledTime,
    } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      service,
      deviceBrand,
      deviceModel,
      issueDescription,
      photos: photos || [],
      serviceMethod,
      address: serviceMethod === 'pickup' ? address : {},
      scheduledDate,
      scheduledTime,
    });

    // Populate service details
    await booking.populate('service', 'name category estimatedPrice estimatedDuration');

    // Create notification for booking confirmation
    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed! 🎉',
      message: `Your repair request for ${deviceBrand} ${deviceModel} has been received. We'll assign a technician shortly.`,
      type: 'booking',
      booking: booking._id,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'name category estimatedPrice estimatedDuration icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('service', 'name category estimatedPrice estimatedDuration icon description');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin/Technician - simplified for demo)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, message, technicianName, estimatedCompletion, totalCost } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update booking fields
    booking.status = status;
    if (technicianName) booking.technicianName = technicianName;
    if (estimatedCompletion) booking.estimatedCompletion = estimatedCompletion;
    if (totalCost) booking.totalCost = totalCost;

    // Add to tracking history
    const statusMessages = {
      confirmed: 'Your booking has been confirmed.',
      assigned: `Technician ${technicianName || ''} has been assigned to your repair.`,
      'picked-up': 'Your device has been picked up.',
      'under-repair': 'Your device is currently being repaired.',
      ready: 'Your device repair is complete and ready for pickup/delivery!',
      completed: 'Your repair has been completed. Thank you for choosing TechCare!',
      cancelled: 'Your booking has been cancelled.',
    };

    booking.trackingHistory.push({
      status,
      message: message || statusMessages[status] || `Status updated to ${status}`,
      timestamp: new Date(),
    });

    await booking.save();

    // Create notification for status update
    await Notification.create({
      user: booking.user,
      title: `Repair Update: ${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}`,
      message: message || statusMessages[status] || `Your repair status has been updated to ${status}.`,
      type: 'status',
      booking: booking._id,
    });

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only allow cancellation if not already under repair or completed
    const nonCancellable = ['under-repair', 'ready', 'completed', 'cancelled'];
    if (nonCancellable.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`,
      });
    }

    booking.status = 'cancelled';
    booking.trackingHistory.push({
      status: 'cancelled',
      message: 'Booking cancelled by customer.',
      timestamp: new Date(),
    });

    await booking.save();

    // Notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Cancelled',
      message: `Your repair booking for ${booking.deviceBrand} ${booking.deviceModel} has been cancelled.`,
      type: 'booking',
      booking: booking._id,
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
