const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

module.exports = createProxyMiddleware({
    target: services.certificate,
    changeOrigin: true,
    on: {
        error: (err, req, res) => {
            res.status(502).json({ err: 'Certificate service unavailable' });
        }
    }
});