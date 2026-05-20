const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    hashPassword: {
        type: String,
        required: true,
        unique: true
    },

    streakCount: {
        type: Number,
        default: 0
    },

    currLevel: {
        type: String
    }
    
})

module.exports = mongoose.model('User', userSchema);