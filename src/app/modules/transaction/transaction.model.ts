import { Schema, model } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    transactionAmount: {
      type: Number,
      required: true,
      min: 10,
    },

    transactionStatus: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
      default: TransactionStatus.PENDING,
    },

    // These will be used only in SEND_MONEY transactions
    receiverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
