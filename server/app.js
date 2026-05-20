const express = require('express');
const app = express();
const port = 3000;
app.use(express.json())
const bcrypt = require('bcrypt')

// AUTH SYSTEM
app.post('/auth/register', async(req, res) => {
    try {
        const {email, password} = req.body
        // logic here
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password required'})
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Just send back success response rn
        // Later, this is where user is saved to MongoDB
        res.status(201).json({
            message: 'User registered successfully',
            user: {email, password: hashedPassword}
        })

    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})