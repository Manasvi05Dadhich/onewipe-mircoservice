const axios = require('axios');
const services = require('../config/service');

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ err: 'no token available' });
        try {
            const res = await axios.get(services.auth + '/verify', {
                headers: {
                    authorization: token
                }
            });
            req.user = res.data.user;
            next();

        } catch (error) {
            res.status(401).json({ err: 'invalid token' });
        }

    }
}