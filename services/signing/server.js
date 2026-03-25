const express = require('express');
const multer = require('multer');
const createHash = require('./hash');
const signHash = require('./sign');
const verify = require('./verify');

const app = express();
const upload = multer();

app.post('/sign', upload.single("pdf"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ err: "No PDF uploaded" });
    }
    const buffer = req.file.buffer;
    const hash = createHash(buffer);
    const signature = signHash(hash);

    res.json({ hash, signature });
});

app.post('/verify', express.json(), (req, res) => {
    if (!req.body) {
        return res.status(400).json({ err: "No file provided" });
    }
    const { hash, signature } = req.body;
    const isValid = verify(hash, signature);
    res.json({ isValid });
})

app.listen(3002, () => {
    console.log("Signing service running on port 3002");
});