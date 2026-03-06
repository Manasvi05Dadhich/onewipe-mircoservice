const crypto = require("crypto");
const fs = require('fs');

const privatekey = fs.readFileSync('./keys/private.pem');

export function signHash(hash) {
    const sign = crypto.sign('RSA-SHA256');
    sign.update(hash);
    return sign.sign(privatekey, 'hex');
}