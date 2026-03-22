const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authMiddleware = require("./middleware/auth");
const User = require("./models/User");
const mongoose = require("mongoose");
require('dotenv').config();

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
});

app.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }
        const isMatch = await bcrypt.compare(password, fakeDB.hashedPassword);
        if (isMatch && fakeDB.role === role) {
            const token = jwt.sign({ email: fakeDB.email, role: fakeDB.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ message: "Login successful", token });
        }
        else {
            res.status(401).json({ err: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ err: "Internal server error" });
    }
});

app.get('/verify', authMiddleware, (req, res) => {
    res.json({ message: "token is valid", user: req.user });
})
app.listen(3001, () => {
    console.log("Auth service running on port 3001");
});