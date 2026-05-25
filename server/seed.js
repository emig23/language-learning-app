// Populate words
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const WordVocabItem = require('./models/WordVocabItem');
const spanishWords = require('./data/spanish.json');
const frenchWords = require('./data/french.json');

const seed = async() => {
    await mongoose.connect(process.env.MONGO_URI);

    await WordVocabItem.deleteMany({});

    const spanish = spanishWords.map(word => ({...word, language: 'spanish'}));
    const french = frenchWords.map(word => ({...word, language: 'french'}));

    await WordVocabItem.insertMany([...spanish, ...french]);

    console.log('Seeded words successfully');
    mongoose.disconnect();
}

seed().catch(console.error);