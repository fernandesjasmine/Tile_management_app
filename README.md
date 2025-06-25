# Tile Management Application

A web-based system for managing and viewing tile products. It supports two user roles:

- **Admin:** Can create, update, and delete tiles.
- **Viewer:** Can view tile lists (product name and SQ code).

This application is built with:

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MySQL
- **Authentication:** JWT-based login with role-based access

---

## Features

- 🔐 **Authentication:** Secure JWT-based login with role-based access (admin, viewer).
- 🛠️ **Admin Dashboard:** Add, edit, and delete tiles with category and application dropdowns.
- 👁️ **Viewer Dashboard:** Displays product name and SQ code with a refresh button.
- 🎨 **Custom Logo:** Branded navigation bar with a custom logo.
- 🗄️ **Database:** MySQL stores categories, applications, products, and users.
- 🔒 **Security:** Passwords hashed using bcrypt, protected routes, token expiration (1 hour).

---

## Tech Stack

### Frontend
- React: `18.3.1`
- React Router DOM: `6.27.0`
- ESLint: `9.13.0` (Airbnb style guide)

### Backend
- Node.js: `22.16.0`
- Express: `4.21.0`
- MySQL2: `3.11.3`
- bcrypt: `5.1.1`
- jsonwebtoken: `9.0.2`
- cors: `2.8.5`
- dotenv: `16.4.5`

### Database
- MySQL: `8.0` (or compatible)

### Development Tools
- npm: `10.8.1`
- Visual Studio Code (Recommended)

---

## Setup Instructions

### Prerequisites
- Node.js `22.16.0` and npm `10.8.1`
- MySQL `8.0`
- (Windows) Install Windows Build Tools:
  ```bash
  npm install -g windows-build-tools
