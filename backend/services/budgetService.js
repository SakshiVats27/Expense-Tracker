const mongoose = require('mongoose');
const budgetModel = require('../db/budgetModel');
const { error } = require('../utils/handler'); // Assuming error helper is available

const resetBudget = async (userId) => {
    try {
        // Delete all budget entries associated with the user
        await budgetModel.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
        // No return value needed from service if controller handles success message
    } catch (e) {
        console.error("Budget Service Error - Reset Budget:", e.message);
        // Rethrow to be caught by the controller
        throw new Error("Failed to reset budgets. Please try again later.");
    }
};

module.exports = {
    resetBudget
};