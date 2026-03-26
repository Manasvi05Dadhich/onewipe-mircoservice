const express = require('express');
const router = express.Router();
const axios = require('axios');

const { authMiddleware } = require('./authmiddleware');
const CERT_SERV = process.env.CERT_SERVICE;
const BLOCKCHAIN_SERV = process.env.BLOCKCHAIN_SERVICE;


router.get('/verify/:hash', authMiddleware, async (req, res) => {
    try {
        const { hash } = req.params;
        if (!hash) {
            return res.status(400).json({ error: "Hash is required" })
        };

        const [certRes, blockRes] = await Promise.all([
            axios.get(`${CERT_SERV}/certificate/${hash}`),
            axios.get(`${BLOCKCHAIN_SERV}/verify/${hash}`)

        ]);

        const certificate = certRes.data;
        const blockchain = blockRes.data;

        res.json({
            isValid: blockchain.isValid && certificate.status != 'revoked',
            certificate,
            blockchain
        });



    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})

module.exports = router;