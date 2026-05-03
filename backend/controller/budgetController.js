const mongoose = require('mongoose');
const budgetModel = require('../db/budgetModel');
const budgetService = require('../services/budgetService'); // Import budgetService
const { error, success } = require('../utils/handler');

const getBudget = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();

        // First try to find the specific month's budget
        let budget = await budgetModel.findOne({ userId, month, year });
        
        // If not found, try to find the MOST RECENT budget for this user to avoid showing 0
        if (!budget) {
            budget = await budgetModel.findOne({ userId }).sort({ createdAt: -1 });
        }
        
        if (!budget) {
            budget = await budgetModel.create({
                userId,
                month,
                year,
                totalBudget: 0,
                categoryBudgets: []
            });
        }

        return res.status(200).json(success(200, budget));
    } catch (e) {
        console.error("Backend getBudget error:", e.message);
        return res.status(500).json(error(500, e.message));
    }
};

const updateBudget = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { totalBudget, categoryBudgets } = req.body;
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();


        const budget = await budgetModel.findOneAndUpdate(
            { userId, month, year },
            { 
                $set: { 
                    totalBudget: Number(totalBudget), 
                    categoryBudgets: categoryBudgets || [],
                    userId: userId,
                    month: month,
                    year: year
                } 
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json(success(200, budget));
    } catch (e) {
        console.error("Backend Budget Update Error:", e.message);
        return res.status(500).json(error(500, e.message));
    }
};

// New controller function for resetting budget
const resetBudget = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        // Call the service function to reset budgets
        await budgetService.resetBudget(userId); 
        return res.status(200).json(success(200, "Budgets reset successfully"));
    } catch (e) {
        console.error("Backend Budget Reset Error:", e.message);
        return res.status(500).json(error(500, e.message));
    }
};

module.exports = {
    getBudget,
    updateBudget,
    resetBudget // Export the new controller function
};