const express = require('express');
const { getServices, getServiceById, getCategories } = require('../controllers/serviceController');

const router = express.Router();

// @route   GET /api/services/categories/list
router.get('/categories/list', getCategories);

// @route   GET /api/services
router.get('/', getServices);

// @route   GET /api/services/:id
router.get('/:id', getServiceById);

module.exports = router;
