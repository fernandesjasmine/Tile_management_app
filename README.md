#  Tile Management Application

A **web-based tile management system** designed for businesses to manage tile products effectively. The application supports two user roles:

- **Admin:** Manage tile products — add, edit, and delete tiles.
- **Viewer:** View the list of tile products with their product name and SQ code.

---

##  Features

-  **Authentication:** Secure JWT-based login system with role-based access (admin and viewer).
-  **Admin Dashboard:** Add, update, and delete tiles. Includes category and application dropdowns.
-  **Viewer Dashboard:** View the list of products with product name and SQ code.
-  **Database:** MySQL backend storing users, categories, applications, and products.
-  **Security:** Passwords hashed with bcrypt, token expiration set to 1 hour, protected backend routes.
-  **Frontend & Backend:** Developed using React for frontend and Node.js (Express) for backend.

---

##  Tech Stack

| Layer        | Technology                            |
|---------------|----------------------------------------|
| **Frontend**  | React `18.3.1`, React Router DOM `6.27.0`, ESLint `9.13.0` (Airbnb) |
| **Backend**   | Node.js `22.16.0`, Express `4.21.0`, MySQL2 `3.11.3`, bcrypt `5.1.1`, jsonwebtoken `9.0.2`, cors `2.8.5`, dotenv `16.4.5` |
| **Database**  | MySQL `8.0`                           |
| **Development Tools** | npm `10.8.1`, Visual Studio Code, Git |

---

## 📁 Project Structure

TILE-VISUALIZER-FRONTEND/

├── backend/ # Backend Node.js API

├── frontend/# React frontend

└── README.md

## 🔧 Setup Instructions

### ✅ Prerequisites

- **Node.js** `22.16.0` and **npm** `10.8.1`
- **MySQL** `8.0`
- (Optional) **Git**
- For Windows: Install Windows Build Tools  
```bash
npm install -g windows-build-tools
```
### Backend Setup
-Navigate to the backend folder.

-Install backend dependencies using npm install.

-Create a .env file in the backend folder with:

  -Database credentials (host, user, password, db name).

  -Server port.

  -JWT secret (generate using Node crypto command).

-Set up the MySQL database:

   Create the database (tile_gallery_db).

   Create tables: category_master, application_master, products, users.

   Insert initial values into category_master and application_master.

-Generate bcrypt password hashes for users:

   Use the provided hashpasswords.js script to hash passwords.

   Insert hashed passwords into the users table.

Start the backend server:

```bash
Copy
Edit
node server.js
```
