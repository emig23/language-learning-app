const express = require('express');
const router = express.Router();
const WordVocabItem = require('../models/WordVocabItem');
const SentenceItem = require('../models/Sentence');
const authMiddleware = require('../middleware/authMiddleware');

// Get words by language, optionally filter by difficulty
router.get('/words', authMiddleware, async (req, res) => {
    try {
        const { language, difficulty } = req.query;

        if (!language) {
            return res.status(400).json({ error: 'Language query param required' });
        }

        const filter = { language };
        if (difficulty) filter.difficulty = difficulty;

        const words = await WordVocabItem.find(filter);
        res.json({ words });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get sentences by language, optionally filter by difficulty
router.get('/sentences', authMiddleware, async (req, res) => {
    try {
        const { language, difficulty } = req.query;

        if (!language) {
            return res.status(400).json({ error: 'Language query param required' });
        }

        const filter = { language };
        if (difficulty) filter.difficulty = difficulty;

        const sentences = await SentenceItem.find(filter);
        res.json({ sentences });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;