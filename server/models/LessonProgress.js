const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    perfect: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);