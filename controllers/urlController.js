const pool = require('../config/db');
const crypto = require('crypto');

// Generate random short code
const generateShortCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

exports.createShortUrl = async (req, res) => {
  const { long_url } = req.body;
  const user_id = req.user.id;

  try {
    let isUnique = false;
    let short_code;

    while (!isUnique) {
      short_code = generateShortCode();
      const [existing] = await pool.query('SELECT * FROM URLs WHERE short_code = ?', [short_code]);
      if (existing.length === 0) {
        isUnique = true;
      }
    }

    // Insert the URL
    const [result] = await pool.query(
      'INSERT INTO URLs (user_id, short_code, long_url) VALUES (?, ?, ?)',
      [user_id, short_code, long_url]
    );

    // Get the created URL
    const [rows] = await pool.query('SELECT * FROM URLs WHERE id = ?', [result.insertId]);

    // Construct the full short URL
    const short_url = `http:localhost:3000/${short_code}`;

    res.status(201).json({
      id: rows[0].id,
      user_id: rows[0].user_id,
      short_code,
      short_url,  // Add the clickable short URL
      long_url: rows[0].long_url,
      created_at: rows[0].created_at,
      clicks: rows[0].clicks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
   

// Get all URLs for a user
exports.getUserUrls = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM URLs WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get URL by ID
exports.getUrlById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM URLs WHERE id = ? AND user_id = ?', 
      [req.params.shortUrl, req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'URL not found or unauthorized' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete URL
exports.deleteUrl = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM URLs WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'URL not found or unauthorized' });
    }
    
    res.json({ msg: 'URL removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Redirect from short URL to original URL

exports.redirectUrl = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM URLs WHERE short_code = ?', [req.params.code]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    // Increment clicks
    await pool.query('UPDATE URLs SET clicks = clicks + 1 WHERE id = ?', [rows[0].id]);

    // Redirect to the long URL
    return res.redirect(rows[0].long_url);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
