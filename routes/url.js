const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls, getUrlById, deleteUrl } = require('../controllers/urlController');
const auth = require('../middleware/auth');

// Create a short URL
router.post('/', auth, createShortUrl);

// Get all URLs for a user
router.get('/', auth, getUserUrls);

// Get specific URL by ID
router.get('/:id', auth, getUrlById);

// Delete a URL
router.delete('/:id', auth, deleteUrl);

module.exports = router;