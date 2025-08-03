"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = require("zod");
const wallet_interface_1 = require("./wallet.interface");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createWalletZodSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid userId",
    }),
    balance: zod_1.z
        .number()
        .min(0, { message: "Balance cannot be negative" }),
    walletStatus: zod_1.z
        .enum(Object.values(wallet_interface_1.WalletStatus))
        .default(wallet_interface_1.WalletStatus.ACTIVE),
});
exports.updateWalletZodSchema = zod_1.z.object({
    balance: zod_1.z
        .number()
        .min(0, { message: "Balance cannot be negative" })
        .optional(),
    walletStatus: zod_1.z
        .enum(Object.values(wallet_interface_1.WalletStatus))
        .optional(),
});
