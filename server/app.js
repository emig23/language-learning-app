require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;


// import routes before using (delete note later)
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')

// connect to database
connectDB()

// mount router (delete note later)
app.use(express.json())
app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})