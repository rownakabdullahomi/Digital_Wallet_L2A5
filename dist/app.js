"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = __importDefault(require("./app/config/env"));
require("./app/config/passport");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.default.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: env_1.default.FRONTEND_URL,
    credentials: true
}));
/// Route
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "⚡ Welcome to Digital Wallet Server..",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
