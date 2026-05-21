const express = require('express');
const router = express.Router(); 
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/userProfile', authMiddleware, async(req, res) => {
    console.log('Route hit')
    console.log('User from token:', req.user)

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

module.exports = router;