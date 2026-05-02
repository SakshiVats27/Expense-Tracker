# Expense Tracker Pro

A professional-grade, full-stack MERN application designed for financial management with high-performance analytics, secure authentication, and a responsive UI.

## 🚀 Key Architectural Features
- **Scalable Backend:** Implemented a Service-Layer pattern to decouple business logic from API controllers.
- **Robust Security:** Hardened with `Helmet.js`, `express-rate-limit`, `hpp`, and `mongo-sanitize`.
- **Request Validation:** Strict data integrity enforced using `Zod` schema validation.
- **Responsive UI:** Built with Tailwind CSS using a flexible CSS Grid system for cross-device consistency.
- **Analytics:** Real-time expense distribution visualization and budget tracking.

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Chart.js, Lucide Icons, React Hot Toast.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Zod.
- **Security:** JWT Authentication, Bcrypt, Helmet, Rate Limiting.

## 📂 Project Structure
```text
backend/
├── controller/     # Request handlers
├── db/             # Mongoose models
├── middleware/     # Security, Auth, Validation
├── router/         # API Route definitions
├── services/       # Business logic (Service Layer)
├── validators/     # Zod schemas
└── utils/          # Helper functions

frontend/
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Main views (Home, Login, Signup)
│   ├── utils/      # API clients and helpers
│   └── index.css   # Global styles & Tailwind
```

## ⚙️ Installation

1. **Clone the repository.**
2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create .env with: PORT_NO, MONGO_URI, JWT_SECRET
   npm start
   ```
3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 💡 Interview Highlights
- **Performance:** Used MongoDB aggregation pipelines for efficient data processing.
- **UX:** Implemented non-intrusive, tiered budget notifications.
- **Architecture:** Transitioned from a monolithic controller approach to a modular **Service-Repository** pattern for better testability and maintenance.
