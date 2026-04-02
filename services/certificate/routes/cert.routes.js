const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const Certificate = require('../model');
const { authMiddleware, requireRole } = require('../auth');

const upload = multer();
router.post('/issue',
    authMiddleware,
    requireRole('university'),
    upload.single('pdf'),
    async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({ err: "No PDF uploaded" });
            }
            const { studentName, studentEmail, course } = req.body;
            if (!studentName || !studentEmail || !course) {
                return res.status(400).json({ err: "studentName, studentEmail, and course are required" });
            }
            const form = new FormData();
            form.append('pdf', req.file.buffer, {
                filename: req.file.originalname || 'certificate.pdf',
                contentType: req.file.mimetype
            });

            const signingResponse = await axios.post(
                process.env.SIGNING_SERVICE + '/sign',
                form,
                { headers: form.getHeaders() }
            );

            const { hash, signature } = signingResponse.data;


            const existing = await Certificate.findOne({ hash });
            if (existing) {
                return res.status(409).json({ err: "Certificate already exists", hash });
            }


            const cert = await Certificate.create({
                issuer: req.user.userId,
                studentName,
                studentEmail,
                course,
                hash,
                signature
            });
            await axios.post((process.env.BLOCKCHAIN_SERVICE || 'http://localhost:3005') + '/store', { hash });

            res.status(201).json({
                message: "Certificate issued",
                certificate: cert
            });

        } catch (error) {
            console.error("Issue error:", error.message);
            res.status(500).json({ err: "Failed to issue certificate" });
        }
    }
);

router.get('/certificate/:hash',
    authMiddleware,
    async (req, res) => {
        try {
            const cert = await Certificate.findOne({ hash: req.params.hash });
            if (!cert) {
                return res.status(404).json({ err: "Certificate not found" });
            }
            res.json({ certificate: cert });
        } catch (error) {
            res.status(500).json({ err: "Internal server error" });
        }
    }
);

router.get('/certificates/student/:email',
    authMiddleware,
    async (req, res) => {
        try {
            const certs = await Certificate.find({ studentEmail: req.params.email });
            res.json({ count: certs.length, certificates: certs });
        } catch (error) {
            res.status(500).json({ err: "Internal server error" });
        }
    }
);

router.patch('/certificate/:hash/revoke',
    authMiddleware,
    requireRole('university'),
    async (req, res) => {
        try {
            const cert = await Certificate.findOne({ hash: req.params.hash });
            if (!cert) {
                return res.status(404).json({ err: "Certificate not found" });
            }

            if (cert.issuer.toString() !== req.user.userId) {
                return res.status(403).json({ err: "Only the original issuer can revoke" });
            }

            if (cert.status === 'revoked') {
                return res.status(400).json({ err: "Certificate already revoked" });
            }
            cert.status = 'revoked';
            await cert.save();
            await axios.post((process.env.BLOCKCHAIN_SERVICE || 'http://localhost:3005') + '/revoke', { hash: req.params.hash });
            res.json({ message: "Certificate revoked", certificate: cert });
        } catch (error) {
            res.status(500).json({ err: "Internal server error" });
        }
    }
);
module.exports = router;
