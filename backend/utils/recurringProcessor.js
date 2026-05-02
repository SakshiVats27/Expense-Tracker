const expenseModel = require('../db/expenseModel');
const userModel = require('../db/userModel');

const processRecurringExpenses = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) return;

    const now = new Date();
    const lastCheck = user.lastRecurringCheck || new Date(user.createdAt);

    // Find all active recurring expenses for this user
    const recurringTemplates = await expenseModel.find({ 
        userId: userId, 
        isRecurring: true 
    });

    for (const template of recurringTemplates) {
        let nextOccurrence = new Date(template.date);
        
        // Skip ahead to the first occurrence after the last check
        while (nextOccurrence <= lastCheck) {
            nextOccurrence = getNextDate(nextOccurrence, template.recurringFrequency);
        }

        // Insert all occurrences between lastCheck and now
        while (nextOccurrence <= now) {
            const newExpense = new expenseModel({
                ...template.toObject(),
                _id: new require('mongoose').Types.ObjectId(),
                date: new Date(nextOccurrence),
                isRecurring: false, // The instances themselves are not templates
                createdAt: undefined,
                updatedAt: undefined
            });
            await newExpense.save();
            nextOccurrence = getNextDate(nextOccurrence, template.recurringFrequency);
        }
    }

    user.lastRecurringCheck = now;
    await user.save();
};

const getNextDate = (date, frequency) => {
    const next = new Date(date);
    if (frequency === 'Daily') next.setDate(next.getDate() + 1);
    else if (frequency === 'Weekly') next.setDate(next.getDate() + 7);
    else if (frequency === 'Monthly') next.setMonth(next.getMonth() + 1);
    else if (frequency === 'Yearly') next.setFullYear(next.getFullYear() + 1);
    return next;
};

module.exports = { processRecurringExpenses };