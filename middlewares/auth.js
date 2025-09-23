const config = require("../config/config.js");
// Simple static-secret auth middleware
// Usage: set ADMIN_SECRET in .env. Client sends header Authorization: Bearer <ADMIN_SECRET>
module.exports = function auth(req, res, next) {
    try {
        const authHeader = req.headers["authorization"] || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
        const expected = config.ADMIN_SECRET;

        if (!expected) {
            return res.status(500).json({ message: "Server misconfigured: ADMIN_SECRET not set" });
        }

        if (!token || token !== expected) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};


