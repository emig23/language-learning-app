const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
    sentence: {
        type: String,
        required: true
    },

    translation: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },

    language: {
        type: String,
        required: true
    },

    wordsUsed: [{
        type: String
    }]
});

module.exports = mongoose.model('Sentences', SentenceSchema);