const express = require('express');
const limiter = require('./middlewar/rateLimiting');
const authMiddleware = require('./middlewar/authmiddleware');
const authRoutes = require('./routes/auth.routes');
const app = express();

app.use(express.json());
app.use(limiter);
app.use('/auth', authMiddleware);
app.use('/cert', gatewayAuth, certProxy);
app.use('/blockchain', gatewayAuth, blockchainProxy);

module.exports = app;