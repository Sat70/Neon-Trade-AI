"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemoUser = seedDemoUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("./models/User");
const DEMO_EMAIL = 'demo@neontrade.ai';
const DEMO_PASSWORD = 'Demo123!';
const SALT_ROUNDS = 12;
async function seedDemoUser() {
    try {
        const existing = await User_1.User.findOne({ email: DEMO_EMAIL });
        if (existing) {
            console.log('Demo user already exists:', DEMO_EMAIL);
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(DEMO_PASSWORD, SALT_ROUNDS);
        await User_1.User.create({
            name: 'Demo User',
            age: 25,
            email: DEMO_EMAIL,
            password: hashedPassword,
        });
        console.log('Demo user created successfully.');
        console.log('  Email:', DEMO_EMAIL);
        console.log('  Password:', DEMO_PASSWORD);
        console.log('  (Use these to test login)');
    }
    catch (err) {
        console.error('Failed to seed demo user:', err.message);
    }
}
//# sourceMappingURL=seedDemoUser.js.map