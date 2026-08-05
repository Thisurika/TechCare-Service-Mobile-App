const express = require('express');
const { getFAQs, getTips } = require('../controllers/supportController');

const router = express.Router();

// @route   GET /api/support/faqs
router.get('/faqs', getFAQs);

// @route   GET /api/support/tips
router.get('/tips', getTips);

module.exports = router;
