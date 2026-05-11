"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not set. Please configure MongoDB connection string in .env');
        process.exit(1);
    }
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            return;
        }
        await mongoose_1.default.connect(uri);
        console.log('Local MongoDB connected ✅');
    }
    catch (error) {
        console.error('MongoDB connection error ❌', error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map