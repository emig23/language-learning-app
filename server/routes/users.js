const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            language: req.user.language,
            streakCount: req.user.streakCount,
            currLevel: req.user.currLevel
        }
    });
});

// Update selected language
router.put('/language', authMiddleware, async (req, res) => {
    try {
        const { language } = req.body;

        if (!language) {
            return res.status(400).json({ error: 'Language is required' });
        }

        req.user.language = language;
        await req.user.save();

        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                language: req.user.language,
                streakCount: req.user.streakCount,
                currLevel: req.user.currLevel
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;