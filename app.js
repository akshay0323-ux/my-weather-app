const express = require('express');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weatherRoutes');
const app = express();
const PORT = process.env.PORT || 3000; // Crucial for deployment later!

// Connect to Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WeatherAppDB')
    .then(() => console.log('Successfully connected to MongoDB! 🎉'))
    .catch(err => console.error('Database connection error:', err));

// Use Routes
app.use('/', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Weather app running on port ${PORT}`);
});