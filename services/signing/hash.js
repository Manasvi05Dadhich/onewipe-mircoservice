const crypto = require("crypto");
const { buffer } = require("stream/consumers");

export function createHash(buffer) {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}