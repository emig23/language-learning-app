const express = require('express');
const router = express.Router(); // router instance
const bcrypt = require('bcrypt');
const User = require('../models/User')

router.post('/register', async(req, res) => {
    try {
        const {email, password} = req.body

        // check if input is correct
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password required'})
        }

        // check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({error: 'Email already exists'})
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create and save user
        const newUser = new User({
            username: email, 
            email: email,
            hashPassword: hashedPassword,
            streakCount: 0,
            currLevel: "Beginner"
        })
        await newUser.save()

        res.status(201).json({
            message: 'User is registered',
            user: {
                email: newUser.email,
                username: newUser.username,
                streakCount: newUser.streakCount,
                currLevel: newUser.currLevel
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
})



module.exports = router