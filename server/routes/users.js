const express = require('express');
const router = express.Router(); 
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/userProfile', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-hashPassword')
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
    }
})

router.patch('/userProfile', authMiddleware, async(req, res) => {
    try {
        const {username, currLevel} = req.body

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username, currLevel },
            { new: true}
        ).select('-hashPassword')

        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'})
        }

        res.status(200).json({user: updatedUser})

    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
    }
})

router.get('/userProfile/streak', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json({streakCount: user.streakCount})
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
    }
})

module.exports = router;