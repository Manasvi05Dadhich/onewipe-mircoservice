require('dotenv').config();
const express = require('express');
const verifyRoutes = require('./routes');

const app = express();
app.use(express.json());

app.use('/', verifyRoutes);

app.listen(3004, () => {
    console.log("Verification service running on port 3004");
});