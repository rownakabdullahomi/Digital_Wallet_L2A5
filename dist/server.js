"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./app/config/env"));
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(env_1.default.DATABASE_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        server = app_1.default.listen(env_1.default.PORT, () => {
            console.log(`⚡ Server is running on port: ${env_1.default.PORT}.`);
        });
    }
    catch (error) {
        console.log(`❌ Error: ${error}`);
        process.exit(1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
/// Unhandled Rejection Error
process.on("unhandledRejection", (error) => {
    console.log("❌ Unhandled Rejection detected... Server is shutting down...", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/// Uncaught Exception Error
process.on("uncaughtException", (error) => {
    console.log("❌ Uncaught Exception detected... Server is shutting down...", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/// Signal Termination
process.on("SIGTERM", () => {
    console.log("❌ SIGTERM signal received... Server is shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/// Signal Initialization
process.on("SIGINT", () => {
    console.log("📶 SIGINT signal received... Server is shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
