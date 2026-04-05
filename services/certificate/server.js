require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const certRoutes = require('./routes/cert.routes');

const app = express();
app.use(express.json());

app.use('/', certRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ err: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ err: err.message || 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Certificate service connected to MongoDB");
        app.listen(3003, () => {
            console.log("Certificate service running on port 3003");
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });
