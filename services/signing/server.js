const express = require('express');
const multer = require('multer');
const hash = require('./hash');
const sign = require('./sign');

const app = express();
const upload = multer();

app.post('/sign', upload.single("pdf"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ err: "No PDF uploaded" });
    }

    const buffer = req.file.buffer;
    const hash = createHash(buffer);
    const sign = signHash(hash);

    res.json({ hash, signature });
})

app.listen(3000, () => {
    console.log("Signing service running on port 3000");
});