const router = require('express').Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

router.use('/blockchain', createProxyMiddleware({
    target: services.blockchain,
    changeOrigin: true,
    pathRewrite: {
        '^/blockchain': ''
    }
}));

module.exports = router;