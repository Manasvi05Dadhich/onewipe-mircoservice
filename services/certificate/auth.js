const jwt = require('jsonwebtoken');

// ----------------------------------------------------------------
// WHY THIS EXISTS:
// Even though the gateway checks tokens, the cert service should
// also verify independently. Never trust that requests only come
// through the gateway — anyone could call localhost:3003 directly.
//
// This uses jwt.verify DIRECTLY instead of calling the auth service
// via HTTP. Faster (no network call) and works even if auth is down.
// Both services share the same JWT_SECRET from .env.
// ----------------------------------------------------------------

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ err: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ err: "Invalid or expired token" });
    }
}

// ----------------------------------------------------------------
// requireRole('university') → only university users can proceed
// MUST be used AFTER authMiddleware (needs req.user to exist)
// ----------------------------------------------------------------
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ err: "Not authenticated" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ err: "Forbidden: insufficient role" });
        }
        next();
    };
}

module.exports = { authMiddleware, requireRole };