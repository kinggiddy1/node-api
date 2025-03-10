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

#### POST /urls
Create a shortened URL.

#### GET /urls
get a shortened URLs.

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
