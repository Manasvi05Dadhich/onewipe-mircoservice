const crypto = require("crypto");

module.exports = function createHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
