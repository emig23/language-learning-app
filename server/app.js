require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Import
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const apiRoutes = require('./routes/api');
const progressRoutes = require('./routes/progress');

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/api', apiRoutes);
app.use('/progress', progressRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});