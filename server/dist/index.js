"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const predictionRoutes_1 = __importDefault(require("./routes/predictionRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = require("./config/db");
const seedDemoUser_1 = require("./seedDemoUser");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
const DEFAULT_ORIGIN = 'http://localhost:5173';
// Allow localhost on any port (Vite may use 5173, 5174, etc.) and explicit CLIENT_ORIGIN
const allowedOrigins = [
    DEFAULT_ORIGIN,
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
];
if (process.env.CLIENT_ORIGIN && !allowedOrigins.includes(process.env.CLIENT_ORIGIN)) {
    allowedOrigins.push(process.env.CLIENT_ORIGIN);
}
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        const allow = !origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        cb(null, allow ? origin || allowedOrigins[0] : false);
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/predictions', predictionRoutes_1.default);
const startServer = async () => {
    await (0, db_1.connectDB)();
    await (0, seedDemoUser_1.seedDemoUser)();
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`API listening on http://localhost:${PORT}`);
        console.log(`  Health check: curl http://localhost:${PORT}/api/health`);
    });
};
startServer()
    .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map