# AirHub | Backend API 🏗️

The engine behind AirHub, providing a robust, type-safe REST API with real-time capabilities.

## 🚀 Technical Highlights

*   **TypeScript Core**: Fully typed controllers, models, and middlewares ensuring a "fail-fast" development cycle.
*   **Real-Time Data**: Integrated Socket.io for event-driven updates (Flight changes, seat availability).
*   **Secure Auth**: State-of-the-art JWT flow using HttpOnly cookies for CSRF/XSS protection.
*   **Schema Validation**: Shared validation logic using Zod for consistent data integrity.
*   **Clean Architecture**: Separation of concerns with dedicated models, controllers, and service layers.

## 🛠️ Tech Stack
- Node.js & Express
- MongoDB & Mongoose
- TypeScript
- Socket.io
- JSON Web Tokens (JWT)

## 🚦 Internal Setup (For Dev)
1. Install dependencies: `npm install`
2. Run in dev mode: `npm run dev`
3. Build for production: `npm run build`