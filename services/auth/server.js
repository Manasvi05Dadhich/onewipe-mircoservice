require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require("./models/User");
const { authMiddleware, requireRole } = require("./middleware/auth");

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ err: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ err: "Email already registered" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, role });

        res.status(201).json({
            message: "User created",
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ err: "Internal server error" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ err: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ err: "Internal server error" });
    }
});

app.get('/verify', authMiddleware, (req, res) => {
    res.json({ message: "Token is valid", user: req.user });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB");
        app.listen(3001, () => {
            console.log("Auth service running on port 3001");
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });