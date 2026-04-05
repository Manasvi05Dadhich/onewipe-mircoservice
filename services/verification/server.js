require('dotenv').config();
const express = require('express');
const verifyRoutes = require('./routes');

const app = express();
app.use(express.json());

app.use('/', verifyRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler — always return JSON, never HTML
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(3004, () => {
    console.log("Verification service running on port 3004");
});