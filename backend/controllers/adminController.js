const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

// ==================== DASHBOARD ====================

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const activeRepairs = await Booking.countDocuments({
      status: { $in: ['confirmed', 'assigned', 'picked-up', 'under-repair'] },
    });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Revenue from completed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Recent bookings (last 10)
    const recentBookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('service', 'name category')
      .sort({ createdAt: -1 })
      .limit(10);

    // Bookings today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today },
    });

    // Total services
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        activeRepairs,
        completedBookings,
        totalRevenue,
        bookingsToday,
        totalServices,
        activeServices,
        bookingsByStatus,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==================== USERS ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = { role: { $ne: 'admin' } };

    if (search) {
      query = {
        role: { $ne: 'admin' },
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create new user (admin)
// @route   POST /api/admin/users
// @access  Admin
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating user',
    });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's bookings count
    const bookingsCount = await Booking.countDocuments({ user: user._id });

    res.json({
      success: true,
      data: { ...user.toJSON(), bookingsCount },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Also clean up user's notifications
    await Notification.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==================== BOOKINGS ====================

// @desc    Get all bookings (admin view — not user-scoped)
// @route   GET /api/admin/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name category estimatedPrice estimatedDuration icon')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: bookings,
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single booking by ID (admin)
// @route   GET /api/admin/bookings/:id
// @access  Admin
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service', 'name category estimatedPrice estimatedDuration icon description');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update booking (status, technician, cost, etc.)
// @route   PUT /api/admin/bookings/:id
// @access  Admin
const updateBooking = async (req, res) => {
  try {
    const { status, technicianName, estimatedCompletion, totalCost, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update fields
    if (status) booking.status = status;
    if (technicianName !== undefined) booking.technicianName = technicianName;
    if (estimatedCompletion) booking.estimatedCompletion = estimatedCompletion;
    if (totalCost !== undefined) booking.totalCost = totalCost;
    if (notes !== undefined) booking.notes = notes;

    // Add tracking history for status change
    if (status) {
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
        message: statusMessages[status] || `Status updated to ${status}`,
        timestamp: new Date(),
      });

      // Create notification for the user
      await Notification.create({
        user: booking.user,
        title: `Repair Update: ${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}`,
        message: statusMessages[status] || `Your repair status has been updated to ${status}.`,
        type: 'status',
        booking: booking._id,
      });
    }

    await booking.save();
    await booking.populate('user', 'name email phone');
    await booking.populate('service', 'name category estimatedPrice estimatedDuration icon');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ==================== SERVICES ====================

// @desc    Get all services (including inactive — admin view)
// @route   GET /api/admin/services
// @access  Admin
const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a service
// @route   POST /api/admin/services
// @access  Admin
const createService = async (req, res) => {
  try {
    const { name, category, description, estimatedPrice, estimatedDuration, icon, image, isActive } = req.body;

    const service = await Service.create({
      name,
      category,
      description,
      estimatedPrice,
      estimatedDuration,
      icon: icon || 'build',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a service
// @route   PUT /api/admin/services/:id
// @access  Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const { name, category, description, estimatedPrice, estimatedDuration, icon, image, isActive } = req.body;

    if (name) service.name = name;
    if (category) service.category = category;
    if (description) service.description = description;
    if (estimatedPrice) service.estimatedPrice = estimatedPrice;
    if (estimatedDuration) service.estimatedDuration = estimatedDuration;
    if (icon) service.icon = icon;
    if (image !== undefined) service.image = image;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete (deactivate) a service
// @route   DELETE /api/admin/services/:id
// @access  Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Soft delete — mark as inactive
    service.isActive = false;
    await service.save();

    res.json({
      success: true,
      message: 'Service deactivated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
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
};
