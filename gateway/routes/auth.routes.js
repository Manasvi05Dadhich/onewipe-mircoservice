const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

module.exports = createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' }
});