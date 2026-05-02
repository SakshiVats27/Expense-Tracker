const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId : {
        type :  mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User',
        index: true
    },
    amount : {
        type : Number,
        required : true 
    },
    category : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    notes : {
        type : String,
    },
    tags : [{
        type : String
    }],
    account : {
        type : String,
        enum : ['Cash', 'Bank', 'Wallet', 'Credit card'],
        default : 'Cash'
    },
    type : {
        type : String,
        enum : ['income' , 'expense'],
        default : 'expense'
    },
    isRecurring : {
        type : Boolean,
        default : false
    },
    recurringFrequency : {
        type : String,
        enum : ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        default : 'Monthly'
    },
    date : {
        type: Date,
        required : true,
    }
},{
    timestamps : true
})

// For fast search across large lists (notes/tags/description/category).
expenseSchema.index({
    notes: 'text',
    tags: 'text',
    description: 'text',
    category: 'text',
});

const expenseModel = mongoose.model('expenses' , expenseSchema);

module.exports = expenseModel;
