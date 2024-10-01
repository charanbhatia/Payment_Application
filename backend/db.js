const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 8
    },

    firstname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true,

    },

    lastname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true,

    },   
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required: true,
    }, 
    balance: {
        type: Number,
        required: true
    }
})

const account  = mongoose.model('Account', accountSchema);
const User =  mongoose.model('User', userSchema);

module.exports = {
    User,
    account
};