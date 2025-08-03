"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionZodSchema = exports.createTransactionZodSchema = void 0;
const zod_1 = require("zod");
const transaction_interface_1 = require("./transaction.interface");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createTransactionZodSchema = zod_1.z.object({
    //   walletId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    //     message: "Invalid wallet Id",
    //   }),
    transactionType: zod_1.z.enum(Object.values(transaction_interface_1.TransactionType)),
    //   transactionStatus: z.enum(Object.values(TransactionStatus) as [string]),
    transactionAmount: zod_1.z
        .number({ message: "Transaction amount must be number" })
        .min(10, "Minimum transaction amount is ৳10"),
    commissionAmount: zod_1.z
        .number({ message: "Commission amount must be number" })
        .min(0, "commissionAmount must be non-negative")
        .optional(),
    agentId: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid agent Id",
    })
        .optional(), // Only needed for add/withdraw from agent
    receiverId: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid receiver user Id",
    })
        .optional(), // Only for send_money
    description: zod_1.z.string({ message: "Description must be string" })
        .min(5, { message: "Description must be at least 5 characters long." })
        .max(100, { message: "Description cannot exceed 100 characters." })
        .optional(),
});
exports.updateTransactionZodSchema = zod_1.z.object({
    walletId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid wallet Id",
    }),
    //   transactionType: z.enum(Object.values(TransactionType) as [string]),
    //   transactionStatus: z.enum(Object.values(TransactionStatus) as [string]),
});
