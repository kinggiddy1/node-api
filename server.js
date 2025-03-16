const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/', require('./routes/url'));


// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener API is running' });
});

// Redirect route for short URLs
app.get('/:code', require('./controllers/urlController').redirectUrl);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});