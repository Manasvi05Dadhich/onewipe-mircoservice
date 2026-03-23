const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

module.exports = createProxyMiddleware({
    target: services.certificate,
    changeOrigin: true,
    pathRewrite: { '^/cert': '' }
});