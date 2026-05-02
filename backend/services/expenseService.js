const expenseModel = require('../db/expenseModel');
const { processRecurringExpenses } = require('../utils/recurringProcessor');
const mongoose = require('mongoose');

const createExpense = async (data, userId) => {
    return await expenseModel.create({ ...data, userId });
};

const deleteExpense = async (expenseId, userId) => {
    return await expenseModel.findOneAndDelete({ _id: expenseId, userId });
};

const getAllExpenses = async (userId) => {
    await processRecurringExpenses(userId);
    return await expenseModel.find({ userId }).sort({ date: -1 });
};

const getCategoryWiseExpenses = async (userId) => {
    return await expenseModel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } }
    ]);
};

const getExpensesPage = async (userId, opts) => {
    await processRecurringExpenses(userId);

    const page = Math.max(parseInt(opts.page, 10) || 1, 1);
    const limitRaw = parseInt(opts.limit, 10) || 20;
    const limit = Math.min(Math.max(limitRaw, 1), 100);
    const skip = (page - 1) * limit;

    const query = { userId };

    if (opts.type && opts.type !== 'all') query.type = opts.type;
    if (opts.category && opts.category !== 'all') query.category = opts.category;
    if (opts.account && opts.account !== 'all') query.account = opts.account;

    if (opts.from || opts.to) {
        query.date = {};
        if (opts.from) query.date.$gte = new Date(opts.from);
        if (opts.to) query.date.$lte = new Date(opts.to);
    }

    if (opts.minAmount != null || opts.maxAmount != null) {
        query.amount = {};
        if (opts.minAmount != null) query.amount.$gte = Number(opts.minAmount);
        if (opts.maxAmount != null) query.amount.$lte = Number(opts.maxAmount);
    }

    if (opts.tags) {
        const tags = String(opts.tags)
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        if (tags.length > 0) query.tags = { $in: tags };
    }

    const allowedSortFields = new Set(['date', 'amount']);
    const sortBy = allowedSortFields.has(opts.sortBy) ? opts.sortBy : 'date';
    const sortDirection = opts.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection, _id: -1 };

    if (opts.search && String(opts.search).trim() !== '') {
        const search = String(opts.search).trim();
        // Prefer MongoDB text index when present.
        query.$text = { $search: search };
    }

    const total = await expenseModel.countDocuments(query);

    let findQuery = expenseModel.find(query).sort(sort).skip(skip).limit(limit);
    if (query.$text) {
        findQuery = expenseModel
            .find(query, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' }, ...sort })
            .skip(skip)
            .limit(limit);
    }

    const items = await findQuery.lean();

    return {
        items,
        page,
        limit,
        total,
        hasMore: skip + items.length < total
    };
};

const getCategorySummary = async (userId, opts) => {
    const match = { userId: new mongoose.Types.ObjectId(userId) };

    if (opts.type && opts.type !== 'all') match.type = opts.type;
    if (opts.from || opts.to) {
        match.date = {};
        if (opts.from) match.date.$gte = new Date(opts.from);
        if (opts.to) match.date.$lte = new Date(opts.to);
    }

    if (opts.account && opts.account !== 'all') match.account = opts.account;

    return await expenseModel.aggregate([
        { $match: match },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
    ]);
};

const getTotalsSummary = async (userId, opts) => {
    const match = { userId: new mongoose.Types.ObjectId(userId) };

    if (opts.type && opts.type !== 'all') match.type = opts.type;
    if (opts.category && opts.category !== 'all') match.category = opts.category;
    if (opts.account && opts.account !== 'all') match.account = opts.account;

    if (opts.from || opts.to) {
        match.date = {};
        if (opts.from) match.date.$gte = new Date(opts.from);
        if (opts.to) match.date.$lte = new Date(opts.to);
    }

    if (opts.minAmount != null || opts.maxAmount != null) {
        match.amount = {};
        if (opts.minAmount != null) match.amount.$gte = Number(opts.minAmount);
        if (opts.maxAmount != null) match.amount.$lte = Number(opts.maxAmount);
    }

    if (opts.search && String(opts.search).trim() !== '') {
        match.$text = { $search: String(opts.search).trim() };
    }

    const rows = await expenseModel.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);

    const income = rows.find(r => r._id === 'income')?.total || 0;
    const expense = rows.find(r => r._id === 'expense')?.total || 0;

    return { income, expense, net: income - expense };
};

module.exports = {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getCategoryWiseExpenses,
    getExpensesPage,
    getCategorySummary,
    getTotalsSummary
};
