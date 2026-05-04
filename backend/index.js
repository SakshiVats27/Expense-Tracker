require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./db/db');
const userRouter = require('./router/userRouter');
const expenseRouter = require('./router/expenseRouter');
const budgetRouter = require('./router/budgetRouter');
const analyticsRouter = require('./router/analyticsRouter');
const securityMiddleware = require('./middleware/security');

const app = express();
app.set('trust proxy', 1);

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');
const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "https://expense-tracker-khaki-eta-31.vercel.app",
  ...configuredOrigins,
]);

const corsOptions = {
  origin: (origin, callback) => {
    const cleanOrigin = normalizeOrigin(origin);

    if (!cleanOrigin || allowedOrigins.has(cleanOrigin) || /^https:\/\/expense-tracker.*\.vercel\.app$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${cleanOrigin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

securityMiddleware(app);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.use('/auth', userRouter);
app.use('/expenses', expenseRouter);
app.use('/budget', budgetRouter);
app.use('/analytics', analyticsRouter);

const port = process.env.PORT_NO || 4000;

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1); // crash loudly instead of silently timing out
  }
};

start();
