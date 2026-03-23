const express = require('express');
const limiter = require('./middlewar/rateLimiting');
const gatewayAuth = require('./middlewar/authmiddleware');
const authProxy = require('./routes/auth.routes');
const certProxy = require('./routes/cert.routes');
const blockchainProxy = require('./routes/blockchain.routes');
const verifyProxy = require('./routes/verify.routes');

const app = express();
app.use(limiter);
app.use('/auth', authProxy);
app.use('/cert', gatewayAuth, certProxy);
app.use('/blockchain', gatewayAuth, blockchainProxy);
app.use('/verify', gatewayAuth, verifyProxy);

module.exports = app;
