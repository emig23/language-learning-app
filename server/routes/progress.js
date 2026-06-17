const express = require('express');
const router = express.Router();
const LessonProgress = require('../models/LessonProgress');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Save lesson completion
router.post('/complete', authMiddleware, async (req, res) => {
    try {
        const { lessonId, language, score, totalQuestions } = req.body;

        if (!lessonId || !language || score === undefined || !totalQuestions) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const points = score * 10;
        const perfect = score === totalQuestions;

        const progress = new LessonProgress({
            userId: req.user._id,
            lessonId,
            language,
            score,
            totalQuestions,
            points,
            perfect,
            completedAt: new Date()
        });
        await progress.save();

        // Update user stats
        const today = new Date().toDateString();
        const lastActive = req.user.lastActiveDate ? new Date(req.user.lastActiveDate).toDateString() : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let newStreak = req.user.streakCount || 0;
        if (lastActive === today) {
            // Already active today, no change
        } else if (lastActive === yesterday) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }

        req.user.streakCount = newStreak;
        req.user.lastActiveDate = new Date();
        req.user.totalPoints = (req.user.totalPoints || 0) + points;
        req.user.lessonsCompleted = (req.user.lessonsCompleted || 0) + 1;
        await req.user.save();

        res.json({
            message: 'Progress saved',
            points,
            perfect,
            streak: newStreak,
            totalPoints: req.user.totalPoints
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get all progress for the current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { language } = req.query;
        const filter = { userId: req.user._id };
        if (language) filter.language = language;

        const progress = await LessonProgress.find(filter).sort({ completedAt: -1 });

        // Build completed lessons map (best score per lesson)
        const lessonMap = {};
        progress.forEach(p => {
            if (!lessonMap[p.lessonId] || p.score > lessonMap[p.lessonId].score) {
                lessonMap[p.lessonId] = {
                    lessonId: p.lessonId,
                    score: p.score,
                    totalQuestions: p.totalQuestions,
                    perfect: p.perfect,
                    completedAt: p.completedAt
                };
            }
        });

        res.json({
            completedLessons: lessonMap,
            totalAttempts: progress.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get full stats for progress page
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const allProgress = await LessonProgress.find({ userId: req.user._id }).sort({ completedAt: -1 });

        // Total lessons completed (unique)
        const uniqueLessons = new Set(allProgress.map(p => `${p.language}-${p.lessonId}`));
        const lessonsCompleted = uniqueLessons.size;

        // Total points
        const totalPoints = allProgress.reduce((sum, p) => sum + p.points, 0);

        // Words learned (unique lessons * 5 words approx)
        const wordsLearned = lessonsCompleted * 5;

        // Recent lessons (last 5)
        const recent = allProgress.slice(0, 5).map(p => ({
            lessonId: p.lessonId,
            language: p.language,
            score: p.score,
            totalQuestions: p.totalQuestions,
            perfect: p.perfect,
            completedAt: p.completedAt
        }));

        // Weekly activity (lessons per day this week)
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(monday.getDate() + mondayOffset);

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyActivity = weekDays.map((day, i) => {
            const dayStart = new Date(monday);
            dayStart.setDate(dayStart.getDate() + i);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const dayLessons = allProgress.filter(p => {
                const d = new Date(p.completedAt);
                return d >= dayStart && d < dayEnd;
            });

            return {
                day,
                active: dayLessons.length > 0,
                count: dayLessons.length
            };
        });

        // Streak
        const streak = req.user.streakCount || 0;

        // Milestones
        const milestones = [
            { label: 'First Lesson', icon: '🎯', desc: 'Complete your first lesson', achieved: lessonsCompleted >= 1, progress: Math.min(lessonsCompleted, 1), target: 1 },
            { label: '3 Day Streak', icon: '🔥', desc: 'Study 3 days in a row', achieved: streak >= 3, progress: Math.min(streak, 3), target: 3 },
            { label: '10 Lessons Done', icon: '📚', desc: 'Complete 10 lessons total', achieved: lessonsCompleted >= 10, progress: Math.min(lessonsCompleted, 10), target: 10 },
            { label: '7 Day Streak', icon: '⚡', desc: 'Study every day for a week', achieved: streak >= 7, progress: Math.min(streak, 7), target: 7 },
            { label: 'First 100 Words', icon: '💬', desc: 'Learn 100 vocabulary words', achieved: wordsLearned >= 100, progress: Math.min(wordsLearned, 100), target: 100 },
        ];

        res.json({
            lessonsCompleted,
            totalPoints,
            wordsLearned,
            streak,
            recent,
            weeklyActivity,
            milestones
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;