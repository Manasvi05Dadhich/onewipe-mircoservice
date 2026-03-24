const axios = require('axios');
const services = require('../config/service');

async function Auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ err: 'No token provided' });
    }
    try {
        const response = await axios.get(services.auth + '/verify', {
            headers: { authorization: token }
        });
        req.user = response.data.user;
        next();
    } catch (error) {
        return res.status(401).json({ err: 'Invalid token' });
    }
}

module.exports = Auth;