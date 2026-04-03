const express = require('express');
const limiter = require('./middlewar/rateLimiting');
const gatewayAuth = require('./middlewar/authmiddleware');
const authProxy = require('./routes/auth.routes');
const certProxy = require('./routes/cert.routes');
const blockchainProxy = require('./routes/blockchain.routes');
const verifyProxy = require('./routes/verify.routes');

const app = express();

// CORS — allow frontend to talk to gateway
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(limiter);
app.use('/auth', authProxy);
app.use('/cert', gatewayAuth, certProxy);
app.use('/blockchain', gatewayAuth, blockchainProxy);
app.use('/verify', gatewayAuth, verifyProxy);

module.exports = app;
