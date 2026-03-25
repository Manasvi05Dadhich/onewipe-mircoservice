require('dotenv').config();

const express = require('express');
const { issueCert, revokeCert, verifyCert } = require('./contract');

const app = express();
app.use(express.json());

app.post('/store', async (req, res) => {
    try {
        const { hash } = req.body;
        if (!hash) return res.status(400).json({ err: "Hash is required" });

        await issueCert(hash);
        res.json({ message: "Certificate stored on blockchain", hash });
    } catch (error) {
        res.status(500).json({ err: "Failed to store on blockchain" });
    }
});

app.get('/verify/:hash', async (req, res) => {
    try {
        const isValid = await verifyCert(req.params.hash);
        res.json({ hash: req.params.hash, isValid });
    } catch (error) {
        res.status(500).json({ err: "Failed to verify" });
    }
});

app.post('/revoke', async (req, res) => {
    try {
        const { hash } = req.body;
        if (!hash) return res.status(400).json({ err: "Hash is required" });

        await revokeCert(hash);
        res.json({ message: "Certificate revoked on blockchain", hash });
    } catch (error) {
        res.status(500).json({ err: "Failed to revoke" });
    }
});

app.listen(3005, () => {
    console.log("Blockchain service running on port 3005");
});
