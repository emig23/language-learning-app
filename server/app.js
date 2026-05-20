const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

// import routes before using (delete note later)
const authRoutes = require('./routes/auth')
// mount router (delete note later)
app.use('/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})