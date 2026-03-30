# 💎 Murex - Modern Luxury E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-c5a059?style=for-the-badge&logo=vercel)](https://murex-ecommerce.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Moemenchakik/Murex)

Murex is a high-end, full-stack e-commerce solution engineered for performance, security, and a premium user experience. Built with the **MERN Stack**, it features a "Modern Luxury" aesthetic using glassmorphism and specialized typography, designed to stand out from generic templates.

---

## 🏗️ Architectural Excellence

### 🔐 5-Layer Security Architecture
Designed with a "Security-First" mindset to protect user data and ensure platform integrity:
1. **Helmet.js:** Hardened HTTP headers to prevent common web vulnerabilities.
2. **NoSQL Sanitization:** Custom middleware to block NoSQL Injection attacks (Express 5 compatible).
3. **Rate Limiting:** Protects against Brute-Force and DDoS attacks on sensitive API endpoints.
4. **JWT & Bcrypt:** Secure, stateless authentication with salted password hashing.
5. **CORS Configuration:** Strict origin control for cross-resource security.

### ⚡ State Management & Optimization
*   **Redux Toolkit (RTK):** Migrated from traditional Redux, reducing component boilerplate by **~40%** and improving data flow predictability.
*   **Consistent API Responses:** Centralized error handling ensuring 100% consistent JSON responses for easier frontend debugging.
*   **Inventory Synchronization:** Real-time stock decrementing logic integrated into the order fulfillment lifecycle.

---

## ✨ Features & UI/UX

*   **Modern Luxury UI:** Specialized glassmorphism effects and **Playfair Display** typography for a high-end boutique aesthetic.
*   **Advanced Product Discovery:** Real-time search and multi-category filtering.
*   **Full CRUD Modules:** Dedicated modules for Products, Orders, Auth, Coupons, and Payments.
*   **Simulated Payment Gateway:** A realistic 1-second latency model with a 95% success rate for production-grade testing.
*   **Admin Command Center:** Granular control over inventory, order status, and user management.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Redux Toolkit, React Router, Axios, CSS Glassmorphism |
| **Backend** | Node.js, Express 5, Mongoose, Multer (File Uploads) |
| **Database** | MongoDB Atlas (Cloud) |
| **DevOps** | Vercel (Frontend), Render (Backend), Git/GitHub |

---

## 🚀 Getting Started

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/Moemenchakik/Murex.git
    npm install && npm run install-server && npm run install-client
    ```
2.  **Environment Setup:** Create a `.env` in `server/` with `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3.  **Launch:** `npm run dev` (Runs both client & server concurrently).

---

## 👨‍💻 Author
**Mouemen El Chakik** - *Full Stack Developer*  
[GitHub](https://github.com/Moemenchakik) | [LinkedIn](https://www.linkedin.com/in/moemenchakik)
