const mongoose = require('mongoose');

const wordVocabItemSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    
    term: {
        type: String,
        required: true,
        trim: true
    },

    partOfSpeech: {
        type: String,
        required: true,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'other']
    },

    gender: {
        type: String,
        enum: ['masculine', 'feminine', 'neutral', null],
        default: null
    },

    translation: {
        type: String,
        required: true,
        trim: true
    },

    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    }
})

module.exports = mongoose.model('words', wordVocabItemSchema);