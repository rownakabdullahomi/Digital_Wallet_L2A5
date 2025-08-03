"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    walletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    transactionType: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    transactionAmount: {
        type: Number,
        required: true,
        min: 10,
    },
    commissionAmount: {
        type: Number,
        min: 0,
    },
    transactionStatus: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionStatus),
        required: true,
        default: transaction_interface_1.TransactionStatus.PENDING,
    },
    // These will be used only in Add money and withdraw transactions
    agentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    // These will be used only in send money user to user
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
