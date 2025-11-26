"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const predictionRoutes_1 = __importDefault(require("./routes/predictionRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = require("./config/db");
const prisma_1 = __importDefault(require("./prisma"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 5000;
const DEFAULT_ORIGIN = 'http://localhost:5173';
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN ?? DEFAULT_ORIGIN,
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/predictions', predictionRoutes_1.default);
const startServer = async () => {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL not set. Please configure Neon connection string in server/.env.');
        process.exit(1);
    }
    // Ensure Prisma can connect to Neon
    await prisma_1.default.$connect();
    // Connect Mongo only if still needed for other features
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
    });
};
startServer()
    .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map