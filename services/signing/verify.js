const crypto = require("crypto");
const fs = require('fs');

const publickey = fs.readFileSync('./keys/public.pem');

export function verifyy(hash, signature) {
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(hash);
    return verify.verify(publickey, signature, "hex");
}

