const express = require('express');
const router = express.Router();
const axios = require('axios');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const { authMiddleware } = require('./authmiddleware');
const CERT_SERV = process.env.CERT_SERVICE;
const BLOCKCHAIN_SERV = process.env.BLOCKCHAIN_SERVICE;

router.get('/verify/:hash', authMiddleware, async (req, res) => {
    try {
        const { hash } = req.params;
        if (!hash) {
            return res.status(400).json({ error: "Hash is required" });
        }

        const cache = await redis.get(`verify:${hash}`);
        if (cache) {
            return res.json(JSON.parse(cache));
        }

        // Forward the auth token to cert service (it also requires JWT)
        const authHeader = req.headers.authorization;

        // Call both services — cert might 404, so handle it separately
        let certificate = null;
        let blockchain = null;

        try {
            const certRes = await axios.get(`${CERT_SERV}/certificate/${hash}`, {
                headers: { authorization: authHeader }
            });
            certificate = certRes.data.certificate;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                certificate = null;  // cert not in DB, that's ok
            } else {
                throw err;
            }
        }

        const blockRes = await axios.get(`${BLOCKCHAIN_SERV}/verify/${hash}`);
        blockchain = blockRes.data;

        const result = {
            isValid: blockchain.isValid && (certificate ? certificate.status !== 'revoked' : false),
            certificate,
            blockchain
        };
        await redis.setex(`verify:${hash}`, 300, JSON.stringify(result));
        res.json(result);
    } catch (error) {
        console.error("Verify error:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
});
module.exports = router;