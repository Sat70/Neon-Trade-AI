"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const requireAuth_1 = require("../middleware/requireAuth");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRouter = (0, express_1.Router)();
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
// Rate limit: only in production to prevent brute-force; disabled in development
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many attempts. Try again later.' },
});
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email) {
    return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}
function toSafeUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        age: user.age,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
}
function signToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET not set');
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
}
// Apply rate limiter only in production (no "Too many attempts" during development)
if (process.env.NODE_ENV === 'production') {
    authRouter.use(authLimiter);
}
// POST /api/auth/signup - Register a new user
authRouter.post('/signup', async (req, res) => {
    const { name, age, email, password } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ message: 'Name is required' });
        return;
    }
    const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
    if (typeof ageNum !== 'number' || Number.isNaN(ageNum) || ageNum < 18) {
        res.status(400).json({ message: 'Age must be 18 or older' });
        return;
    }
    if (!validateEmail(email)) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!password || typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }
    try {
        // Check if email already exists
        const existing = await User_1.User.findOne({ email: trimmedEmail });
        if (existing) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }
        // Hash password and create user
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const user = await User_1.User.create({
            name: name.trim(),
            age: ageNum,
            email: trimmedEmail,
            password: hashedPassword,
        });
        const token = signToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            age: user.age,
        });
        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(201).json({
            user: toSafeUser(user),
            token,
        });
    }
    catch (err) {
        console.error('Signup error', err);
        res.status(500).json({ message: 'Registration failed' });
    }
});
// POST /api/auth/login - Authenticate user
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!validateEmail(email)) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
    }
    if (!password || typeof password !== 'string') {
        res.status(400).json({ message: 'Password is required' });
        return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    try {
        const user = await User_1.User.findOne({ email: trimmedEmail });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = signToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            age: user.age,
        });
        res.cookie('token', token, COOKIE_OPTIONS);
        res.json({
            user: toSafeUser(user),
            token,
        });
    }
    catch (err) {
        console.error('Login error', err);
        res.status(500).json({ message: 'Login failed' });
    }
});
// POST /api/auth/logout - Clear auth cookie
authRouter.post('/logout', (_req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.json({ message: 'Logged out' });
});
// GET /api/auth/me - Get current authenticated user
authRouter.get('/me', requireAuth_1.requireAuth, async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        res.json({ user: toSafeUser(user) });
    }
    catch (err) {
        console.error('Me error', err);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map