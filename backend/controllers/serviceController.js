const Service = require('../models/Service');

// @desc    Get all services (with optional category filter)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    let services = await Service.find(query).sort({ category: 1, name: 1 });

    // Simple text search on name and description
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get service categories with counts
// @route   GET /api/services/categories/list
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          minPrice: { $min: '$estimatedPrice.min' },
          maxPrice: { $max: '$estimatedPrice.max' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryInfo = {
      smartphone: { label: 'Smartphones', icon: 'smartphone' },
      laptop: { label: 'Laptops', icon: 'laptop' },
      television: { label: 'Televisions', icon: 'tv' },
      'air-conditioner': { label: 'Air Conditioners', icon: 'ac-unit' },
      refrigerator: { label: 'Refrigerators', icon: 'kitchen' },
      'washing-machine': { label: 'Washing Machines', icon: 'local-laundry-service' },
    };

    const result = categories.map((cat) => ({
      ...cat,
      category: cat._id,
      ...categoryInfo[cat._id],
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { getServices, getServiceById, getCategories };
