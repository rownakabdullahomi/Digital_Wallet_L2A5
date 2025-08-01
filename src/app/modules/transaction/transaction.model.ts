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
    commissionAmount: {
      type: Number,
      min: 0,
    },

    transactionStatus: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
      default: TransactionStatus.PENDING,
    },

    // These will be used only in Add money and withdraw transactions
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    // These will be used only in send money user to user
    receiverId: {
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
