const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls, getUrlById, deleteUrl } = require('../controllers/urlController');
const auth = require('../middleware/auth');

// Create a short URL
router.post('/shorten', auth, createShortUrl);

// Get all URLs for a user
router.get('/urls', auth, getUserUrls);

// Get specific URL by ID
router.get('/analytics/:shortUrl', auth, getUrlById);   

// Delete a URL
router.delete('/:id', auth, deleteUrl);

module.exports = router; 