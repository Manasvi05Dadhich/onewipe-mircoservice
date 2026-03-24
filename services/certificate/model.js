const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    studentEmail: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    hash: {
        type: String,
        required: true,
        unique: true
    },

    signature: {
        type: String,
        required: true
    },

    issuedAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["active", "revoked"],
        default: "active"
    }
});

module.exports = mongoose.model("Certificate", certificateSchema);