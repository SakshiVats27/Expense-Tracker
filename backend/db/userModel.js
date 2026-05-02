const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required  : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String ,
        required : true,
    },
    refreshToken: {
        type: String,
        select: false
    },
    lastRecurringCheck: {
        type: Date,
        default: Date.now
    }
    },{
    timestamps : true,
})

const userModel = mongoose.model('User' , userSchema);

module.exports = userModel;