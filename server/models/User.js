const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

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
        required: true
    },

    language: {
        type: String,
        default: null
    },

    streakCount: {
        type: Number,
        default: 0
    },

    totalPoints: {
        type: Number,
        default: 0
    },

    lessonsCompleted: {
        type: Number,
        default: 0
    },

    lastActiveDate: {
        type: Date,
        default: null
    },

    currLevel: {
        type: String,
        default: 'Beginner'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);