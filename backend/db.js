const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://charanbhatia:charan@cluster0.frumadv.mongodb.net/")

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

const User =  mongoose.model('User', userSchema);

module.exports = {
    User
};
 