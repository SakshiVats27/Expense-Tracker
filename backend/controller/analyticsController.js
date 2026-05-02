const expenseModel = require('../db/expenseModel');
const { success, error } = require('../utils/handler');
const mongoose = require('mongoose');

const getAdvancedAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Month-over-Month Comparison
        const currentMonthData = await expenseModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense', date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const lastMonthData = await expenseModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense', date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const currentTotal = currentMonthData[0]?.total || 0;
        const lastTotal = lastMonthData[0]?.total || 0;
        const diffPercent = lastTotal === 0 ? 100 : ((currentTotal - lastTotal) / lastTotal) * 100;

        // 2. Category Trend (Last 6 months)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const categoryTrend = await expenseModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense', date: { $gte: sixMonthsAgo } } },
            { 
                $group: { 
                    _id: { 
                        month: { $month: "$date" }, 
                        year: { $year: "$date" },
                        category: "$category" 
                    }, 
                    total: { $sum: "$amount" } 
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 3. Daily Spending (Heatmap data - Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailySpending = await expenseModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense', date: { $gte: thirtyDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                    total: { $sum: "$amount" } 
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        return res.status(200).json(success(200, {
            comparison: {
                currentTotal,
                lastTotal,
                diffPercent: diffPercent.toFixed(1)
            },
            categoryTrend,
            dailySpending,
            forecast: (currentTotal / now.getDate()) * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        }));
    } catch (e) {
        return res.status(500).json(error(500, e.message));
    }
};

module.exports = { getAdvancedAnalytics };