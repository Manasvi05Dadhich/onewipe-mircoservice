const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }
        const hashed = await bcrypt.hash(password, 10);
        res.json({ email, hashed_password: hashed, role });

    } catch (error) {
        res.status(500).json({ err: "Internal server error" });
    }
})

app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    const fakeDB = {
        email: "manas@test.com",
        hashedPassword: "$2b$10$nQenN08aN5VHIBBNzsd7d.VfFIMQzi34BSVGKBP3XiALC6mhi0oBO",
        role: "university"
    };

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const isMatch = await bcrypt.compare(password, fakeDB.hashedPassword);
        if (isMatch && fakeDB.role === role) {
            res.json({ message: "Login successful" });
        }
        else {
            res.status(401).json({ err: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ err: "Internal server error" });
    }
})

app.listen(3001, () => {
    console.log("Auth service running on port 3001");
});