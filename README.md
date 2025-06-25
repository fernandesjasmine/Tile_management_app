# Tile_management_app
Tile Management Application

The Tile Management Application is a web-based system for managing and viewing tile products. It supports two user roles: Admin (create, update, delete tiles) and Viewer (view tile list with product name and SQ code). Built with a React frontend, Node.js/Express backend, and MySQL database, it features JWT-based authentication and a custom logo for branding.

Features





Authentication: JWT-based login with role-based access control for admin and viewer users.



Admin Dashboard: Form to add, edit, and delete tiles, with category and application dropdowns.



Viewer Dashboard: Displays a list of tiles (product name and SQ code) with a refresh button, no upload or preview functionality.



Custom Logo: Displayed in the navigation bar for a branded user experience.



Database: MySQL stores categories, applications, products, and user credentials.



Security: Passwords hashed with bcrypt, protected routes, and token expiration (1 hour).

Tech Stack





Frontend:





React: 18.3.1



React Router DOM: 6.27.0



ESLint: 9.13.0 (Airbnb style guide)



Backend:





Node.js: 22.16.0



Express: 4.21.0



MySQL2: 3.11.3



bcrypt: 5.1.1



jsonwebtoken: 9.0.2



cors: 2.8.5



dotenv: 16.4.5



Database:





MySQL: 8.0 (or compatible)



Development Tools:





npm: 10.8.1



Windows Build Tools (Windows only, for bcrypt)



Environment:





OS: Windows 10/11 (adaptable for macOS/Linux)



IDE: Visual Studio Code (recommended)

Developer Notes

Setup Instructions





Prerequisites:





Install Node.js 22.16.0 (node -v, npm -v).



Install MySQL 8.0 (configure with user root, password neethu@1005).



(Windows) Install Windows Build Tools: npm install -g windows-build-tools.



(Optional) Install Git.
