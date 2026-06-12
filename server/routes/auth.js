const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const domain = email.split('@')[1];
  if (!domain) return false;
  const validTLDs = ['com', 'net', 'org', 'edu', 'gov', 'io', 'co', 'us', 'uk', 'ca', 'de', 'fr', 'es', 'it', 'app', 'dev', 'me', 'info', 'xyz', 'tech', 'ai'];
  const tld = domain.split('.').pop().toLowerCase();
  return regex.test(email) && validTLDs.includes(tld);
}

// Validate password strength
function isValidPassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include a number';
  return null;
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email and password required' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        const passwordError = isValidPassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username: email,
            email,
            hashPassword: hashedPassword,
            language: null,
            streakCount: 0,
            currLevel: 'Beginner'
        });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                language: newUser.language,
                streakCount: newUser.streakCount,
                currLevel: newUser.currLevel
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.hashPassword);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Password incorrect' });
        }

        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                language: existingUser.language,
                streakCount: existingUser.streakCount,
                currLevel: existingUser.currLevel
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;