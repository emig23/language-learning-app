// Populate words
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const WordVocabItem = require('./models/WordVocabItem');
const SentenceItem = require('./models/Sentence');
const spanishWords = require('./data/spanish.json');
const frenchWords = require('./data/french.json');
const spanishSentences = require('./data/spanishSentences.json');
const frenchSentences = require('./data/frenchSentences.json');

const seed = async() => {
    await mongoose.connect(process.env.MONGO_URI);

    // Words
    await WordVocabItem.deleteMany({});
    const spanish = spanishWords.map(word => ({...word, language: 'spanish'}));
    const french = frenchWords.map(word => ({...word, language: 'french'}));
    await WordVocabItem.insertMany([...spanish, ...french]);
    console.log('Seeded words successfully');

    // Sentences
    await SentenceItem.deleteMany({});
    const spanishS = spanishSentences.map(s => ({...s, language: 'spanish'}));
    const frenchS = frenchSentences.map(s => ({...s, language: 'french'}));
    await SentenceItem.insertMany([...spanishS, ...frenchS]);
    console.log('Seeded sentences successfully');

    mongoose.disconnect();
}

seed().catch(console.error);