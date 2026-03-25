require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const certRoutes = require('./routes/cert.routes');

const app = express();
app.use(express.json());

app.use('/', certRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Certificate service connected to MongoDB");
        app.listen(3003, () => {
            console.log("Certificate service running on port 3003");
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });
