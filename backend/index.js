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

securityMiddleware(app);

app.use(cors());
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