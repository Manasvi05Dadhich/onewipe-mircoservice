const crypto = require("crypto");
const fs = require('fs');

const privatekey = fs.readFileSync('../keys/private.pem');

module.exports = function signHash(hash) {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(hash);
    return signer.sign(privatekey, 'hex');
}

