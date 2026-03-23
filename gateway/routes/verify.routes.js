const router = require('express').Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

router.use('/verify', createProxyMiddleware({
    target: services.verification,
    changeOrigin: true,
    pathRewrite: {
        '^/verify': ''
    }
}));

module.exports = router;