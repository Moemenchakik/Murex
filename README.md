# Murex - Modern E-Commerce Platform

Murex is a full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern UI, robust state management with Redux Toolkit, and a professional backend architecture.

## 🚀 Features

### Frontend
- **Product Catalog:** Advanced search and category filtering.
- **Shopping Cart:** Fully functional cart with persistent storage.
- **User Authentication:** Secure login and registration with JWT.
- **User Profile:** Manage personal info and view order history.
- **Wishlist:** Save products for later.
- **Reviews & Ratings:** User-submitted reviews for products.
- **Checkout Process:** Multi-step checkout with coupon support.
- **Admin Dashboard:** Manage products, orders, and users.

### Backend
- **RESTful API:** Clean and predictable API structure.
- **Centralized Error Handling:** Global middleware for consistent error responses.
- **Inventory Management:** Automatic stock decrement upon successful orders.
- **Security:** Protected routes and password hashing with Bcrypt.
- **Database:** Optimized Mongoose schemas and relationships.

## 🛠️ Tech Stack

**Client:** React, Redux Toolkit, React Router, Axios, CSS Modules.
**Server:** Node.js, Express, MongoDB (Mongoose).
**Tools:** JWT for Auth, Bcrypt for security.

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Moemenchakik/Murex.git
   cd Murex
   ```

2. Install dependencies for the root, server, and client:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```

4. Run the application:
   ```bash
   # From the root directory
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.
