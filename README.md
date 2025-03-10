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

```bash
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
```
