"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const authRouter = (0, express_1.Router)();
const TOKEN_EXPIRY = '7d';
const buildToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
};
authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    try {
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = buildToken({ id: user.id, email: user.email, name: user.name });
        return res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    }
    catch (error) {
        console.error('Register error', error);
        return res.status(500).json({ message: 'Failed to register user.' });
    }
});
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token = buildToken({ id: user.id, email: user.email, name: user.name });
        return res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    }
    catch (error) {
        console.error('Login error', error);
        return res.status(500).json({ message: 'Failed to login.' });
    }
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map