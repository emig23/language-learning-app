require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;


// import routes before using 
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')

// connect to database
connectDB()

// mount router 
app.use(express.json())
app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})