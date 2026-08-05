const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/support/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ category: 1, order: 1 });

    res.json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get maintenance tips
// @route   GET /api/support/tips
// @access  Public
const getTips = async (req, res) => {
  try {
    const tips = [
      {
        id: 1,
        category: 'smartphone',
        title: 'Smartphone Care Tips',
        icon: 'smartphone',
        tips: [
          'Use a screen protector and protective case to prevent damage.',
          'Avoid charging your phone overnight to preserve battery health.',
          'Keep your software updated for security and performance.',
          'Clean charging ports gently with compressed air.',
          'Avoid exposing your phone to extreme temperatures.',
        ],
      },
      {
        id: 2,
        category: 'laptop',
        title: 'Laptop Maintenance',
        icon: 'laptop',
        tips: [
          'Clean your keyboard and vents regularly with compressed air.',
          'Keep your laptop on a flat, hard surface for proper ventilation.',
          'Update your operating system and drivers regularly.',
          'Use a surge protector to prevent electrical damage.',
          'Calibrate your battery every few months for accurate readings.',
        ],
      },
      {
        id: 3,
        category: 'television',
        title: 'TV Care Guide',
        icon: 'tv',
        tips: [
          'Clean the screen with a soft microfiber cloth — no harsh chemicals.',
          'Ensure adequate ventilation around your TV.',
          'Use a voltage stabilizer to protect from power surges.',
          'Adjust brightness to moderate levels to extend panel life.',
          'Turn off the TV when not in use to conserve energy.',
        ],
      },
      {
        id: 4,
        category: 'air-conditioner',
        title: 'AC Maintenance',
        icon: 'ac-unit',
        tips: [
          'Clean or replace air filters every 1-2 months.',
          'Schedule annual professional servicing.',
          'Keep the outdoor unit clear of debris and obstructions.',
          'Set temperature to 24°C for optimal efficiency.',
          'Check for refrigerant leaks if cooling performance drops.',
        ],
      },
      {
        id: 5,
        category: 'refrigerator',
        title: 'Refrigerator Tips',
        icon: 'kitchen',
        tips: [
          'Clean condenser coils every 6 months for efficiency.',
          'Don\'t overfill — allow air to circulate for even cooling.',
          'Check and replace door seals if they\'re loose.',
          'Set temperature to 3-5°C for the fridge and -18°C for the freezer.',
          'Defrost regularly if your model doesn\'t have auto-defrost.',
        ],
      },
      {
        id: 6,
        category: 'washing-machine',
        title: 'Washing Machine Care',
        icon: 'local-laundry-service',
        tips: [
          'Run a cleaning cycle with vinegar monthly to prevent odors.',
          'Don\'t overload — follow the recommended capacity.',
          'Leave the door open after use to prevent mold.',
          'Check and clean the lint filter regularly.',
          'Use the correct amount of detergent for your load size.',
        ],
      },
    ];

    res.json({
      success: true,
      data: tips,
    });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { getFAQs, getTips };
