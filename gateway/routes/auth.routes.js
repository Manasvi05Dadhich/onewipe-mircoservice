const router = require('express').Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

router.use('/auth', createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/auth': ''
    }
}));

module.exports = router;