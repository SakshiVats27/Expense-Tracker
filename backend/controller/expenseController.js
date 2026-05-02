const expenseService = require('../services/expenseService');
const { error, success } = require('../utils/handler');
const { sendEmailWithAttachment } = require('../utils/emailSend');

const createExpense = async (req, res) => {
  try {
    const { amount, category, date, notes, type, account, tags, isRecurring, recurringFrequency } = req.body;
    const userId = req.user.userId;

    if (!amount || !category || !date) {
      return res.status(400).json(error(400, "Amount, category, and date are required"));
    }

    const newExpense = await expenseService.createExpense({
      amount, category, date: new Date(date), notes,
      type: type || 'expense', account: account || 'Cash',
      tags: tags || [], isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || 'Monthly'
    }, userId);
    
    return res.status(201).json(success(201, newExpense));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;
    const userId = req.user.userId;
    const expense = await expenseService.deleteExpense(expenseId, userId);

    if (!expense) return res.status(404).json(error(404, "Expense not found or unauthorized"));
    return res.status(200).json(success(200, "Expense deleted successfully"));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.user.userId);
    return res.status(200).json(success(200, expenses));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const getCategoryExpense = async (req, res) => {
  try {
    const result = await expenseService.getCategoryWiseExpenses(req.user.userId);
    return res.status(200).json(success(200, result));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const listExpenses = async (req, res) => {
  try {
    const result = await expenseService.getExpensesPage(req.user.userId, {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      type: req.query.type,
      category: req.query.category,
      account: req.query.account,
      from: req.query.from,
      to: req.query.to,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount,
      tags: req.query.tags,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    return res.status(200).json(success(200, result));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const result = await expenseService.getCategorySummary(req.user.userId, {
      type: req.query.type,
      from: req.query.from,
      to: req.query.to,
      account: req.query.account,
    });
    return res.status(200).json(success(200, result));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const getTotalsSummary = async (req, res) => {
  try {
    const result = await expenseService.getTotalsSummary(req.user.userId, {
      search: req.query.search,
      type: req.query.type,
      category: req.query.category,
      account: req.query.account,
      from: req.query.from,
      to: req.query.to,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount,
    });
    return res.status(200).json(success(200, result));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

const emailSender = async (req, res) => {
  try {
    const { recipient, body } = req.body;

    if (!recipient) {
      return res.status(400).json(error(400, 'Recipient is required'));
    }

    const items = Array.isArray(body) ? body : [];
    await sendEmailWithAttachment(recipient, items);

    return res.status(200).json(success(200, 'Email sent'));
  } catch (e) {
    return res.status(500).json(error(500, e.message));
  }
};

module.exports = {
  createExpense,
  deleteExpense,
  getCategoryExpense,
  getAllExpenses,
  listExpenses,
  getCategorySummary,
  getTotalsSummary,
  emailSender,
};
