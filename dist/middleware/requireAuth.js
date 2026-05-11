"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
function requireAuth(req, res, next) {
    const token = req.cookies?.token ??
        (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (!JWT_SECRET) {
        console.error('JWT_SECRET not set');
        res.status(500).json({ message: 'Server misconfiguration' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=requireAuth.js.map