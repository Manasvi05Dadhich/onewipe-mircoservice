module.exports = {
    auth:         process.env.AUTH_SERVICE         || 'http://localhost:3001',
    signing:      process.env.SIGNING_SERVICE      || 'http://localhost:3002',
    certificate:  process.env.CERT_SERVICE         || 'http://localhost:3003',
    verification: process.env.VERIFY_SERVICE       || 'http://localhost:3004',
    blockchain:   process.env.BLOCKCHAIN_SERVICE   || 'http://localhost:3005'
}