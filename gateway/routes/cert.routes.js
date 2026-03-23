
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('../config/service');

router.use('/certificate', createProxyMiddleware({
    target: services.certificate,
    changeOrigin: true,
    pathRewrite: {
        '^/certificate': ''
    }
}));

module.exports = router;