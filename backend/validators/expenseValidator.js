const { z } = require('zod');

const createExpenseSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Date must be YYYY-MM-DD")),
    notes: z.string().max(160, "Notes must be 160 characters or less").optional(),
    type: z.enum(['expense', 'income']).optional(),
    account: z.enum(['Cash', 'Bank', 'Wallet', 'Credit card']).optional(),
    tags: z.array(z.string().trim().min(1).max(24, "Each tag must be 24 characters or less")).max(12, "Use 12 tags or fewer").optional(),
    isRecurring: z.boolean().optional(),
    recurringFrequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly']).optional()
});

module.exports = { createExpenseSchema };
