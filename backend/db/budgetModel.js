const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    month: {
        type: Number, // 0-11
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalBudget: {
        type: Number,
        default: 0
    },
    categoryBudgets: [{
        category: String,
        limit: Number
    }]
}, {
    timestamps: true
});

// Ensure one budget record per user per month/year
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const budgetModel = mongoose.model('budgets', budgetSchema);

module.exports = budgetModel;