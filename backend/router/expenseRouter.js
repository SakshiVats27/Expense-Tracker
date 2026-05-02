const { createExpense, deleteExpense, getCategoryExpense,
        getAllExpenses, listExpenses, getCategorySummary, getTotalsSummary, emailSender } = require('../controller/expenseController');
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validator');
const { createExpenseSchema } = require('../validators/expenseValidator');

// All expense routes require a valid JWT
router.use(authMiddleware);

router.post('/addExpense', validate(createExpenseSchema), createExpense);
router.post('/deleteExpense', deleteExpense);
router.get('/categoryExpense', getCategoryExpense);
router.get('/list', listExpenses);
router.get('/categorySummary', getCategorySummary);
router.get('/totalsSummary', getTotalsSummary);
router.post('/allExpenses', getAllExpenses);
router.post('/sendEmail', emailSender);

module.exports = router;
