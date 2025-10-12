# working live demo 
  
https://url-shortener.thefocalmedia.com/
     
     
# URL Shortener Application - Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
   - [Local Development Setup](#local-development-setup)
3. [Authentication Details](#authentication-details)
   - [JWT Implementation](#jwt-implementation)

## Project Overview

This application is a full-stack URL shortener with features similar to Bit.ly. It provides:

- Secure user authentication
- URL shortening capabilities
- Analytics for shortened URLs
- User-specific URL management
- Modern, responsive UI 

## Setup Instructions

### Prerequisites

- Node.js v20.17.0 (for backend and frontend)
- MySQL (for database)
- npm

### Local Development Setup

#### Backend Setup

````bash
# Clone the repository
git clone https://github.com/kinggiddy1/node-api.git
cd node-api

# Install dependencies
npm install

CREATE DATABASE url_shortener;
USE url_shortener;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE URLs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  short_code VARCHAR(10) NOT NULL UNIQUE,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  clicks INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

##  Run the program

node server.js


## Authentication Details

email: egide@gmail.com
password: 123

or create an account

### JWT Implementation

The application uses a secure JWT-based authentication system:

- **Access Tokens**: Short-lived JWTs (1 hour) for API authorization
- **Token Storage**: Access tokens stored in local storage

### Authentication Endpoints

#### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "username": "egideT",
  "email": "egide@gmail.com",
  "password": "123"
}
````

**Response (201 Created):**

```json
{
  "id": 1,
  "username": "egide",
  "email": "egide@gmail.com",
  "created_at": "2025-03-10T12:00:00Z"
}
```

**Error Responses:**

- `400 Bad Request`: "msg": "User already exists"
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

#### POST /auth/login

Authenticate a user and receive JWT tokens.

**Request Body:**

````json
{
  "email": "egide@gmail.com",
  "password": "123"
}

### URL Shortener Endpoints

#### POST /shorten
Create a shortened URL.

#### GET /urls
get a shortened URLs.

#### GET /analytics/:shortUrl 
get a shortened URLs by ID.

**Authorization:** Bearer Token required

**Request Body:**
```json
{
  "long_url": "https://example.com/very/long/url/that/needs/shortening",
}
````

**Response (201 Created):**

```json
{
  "id": 1,
  "short_code": "abc123",
  "short_url": "https://localhost/abc123",
  "long_url": "https://example.com/very/long/url/that/needs/shortening",
  "created_at": "2025-03-10T12:00:00Z",
  "clicks": 0
}
```

**Error Responses:**

- `400 Bad Request`: Invalid URL format or custom code already taken
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error



### Tests
## Authentication Tests
// Mock dependencies
jest.mock('../config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
    });

    test('should return 400 if user already exists', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1 }]]);
      
      await authController.register(req, res);
      
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Users WHERE email = ?', ['test@example.com']);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists' });
    });

    test('should create a new user and return token if successful', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'test-token');
      });
      
      await authController.register(req, res);
      
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
        ['testuser', 'test@example.com', 'hashedpassword']
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'test-token' });
    });

    test('should return 500 if server error occurs', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
    });

    test('should return 400 if user does not exist', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      
      await authController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('should return 400 if password is incorrect', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1, password_hash: 'hashedpassword' }]]);
      bcrypt.compare.mockResolvedValue(false);
      
      await authController.login(req, res);
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('should login user and return token if credentials are valid', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1, password_hash: 'hashedpassword' }]]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'test-token');
      });
      
      await authController.login(req, res);
      
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'test-token' });
    });

    test('should return 500 if server error occurs', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      await authController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('getUser', () => {
    beforeEach(() => {
      req.user = { id: 1 };
    });

    test('should return user data if user is found', async () => {
      const userData = { 
        id: 1, 
        username: 'testuser', 
        email: 'test@example.com', 
        created_at: '2025-03-10T12:00:00Z' 
      };
      pool.query.mockResolvedValueOnce([[userData]]);
      
      await authController.getUser(req, res);
      
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, username, email, created_at FROM Users WHERE id = ?',
        [1]
      );
      expect(res.json).toHaveBeenCalledWith(userData);
    });

    test('should return 404 if user is not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      
      await authController.getUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });

    test('should return 500 if server error occurs', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      
      await authController.getUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});

## server Tests

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const authRouter = require('../routes/auth');
const urlRouter = require('../routes/url');
const { redirectUrl } = require('../controllers/urlController');

// Mock controllers
jest.mock('../controllers/authController');
jest.mock('../controllers/urlController');

describe('Server', () => {
  let app;

  beforeEach(() => {
    app = express();
    
    // Configure middleware
    app.use(cors({
      origin: 'http://localhost:4200',
      credentials: true
    }));
    app.use(express.json());
    
    // Routes
    app.use('/api/auth', authRouter);
    app.use('/api/urls', urlRouter);
    
    // Basic route
    app.get('/', (req, res) => {
      res.json({ message: 'URL Shortener API is running' });
    });
    
    // Redirect route
    app.get('/:code', redirectUrl);
  });

  test('GET / should return API running message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'URL Shortener API is running' });
  });

  test('should parse JSON body', async () => {
    // Mock implementation for testing JSON parsing
    const mockBodyHandler = jest.fn((req, res) => {
      res.json({ receivedBody: req.body });
    });
    
    app.post('/test-json', mockBodyHandler);
    
    const testBody = { test: 'data' };
    const response = await request(app)
      .post('/test-json')
      .send(testBody);
    
    expect(response.status).toBe(200);
    expect(response.body.receivedBody).toEqual(testBody);
  });
  
  test('should have CORS headers', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:4200');
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});
