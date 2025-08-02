import { z } from "zod";
import { TransactionType } from "./transaction.interface";
import mongoose from "mongoose";

export const createTransactionZodSchema = z.object({
//   walletId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
//     message: "Invalid wallet Id",
//   }),

  transactionType: z.enum(Object.values(TransactionType) as [string]),

//   transactionStatus: z.enum(Object.values(TransactionStatus) as [string]),

  transactionAmount: z
    .number({ message: "Transaction amount must be number" })
    .min(10, "Minimum transaction amount is ৳10"),

  commissionAmount: z
    .number({ message: "Commission amount must be number" })
    .min(0, "commissionAmount must be non-negative")
    .optional(),

  agentId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid agent Id",
    })
    .optional(), // Only needed for add/withdraw from agent

  receiverId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid receiver user Id",
    })
    .optional(), // Only for send_money

  description: z.string({ message: "Description must be string" })
    .min(5, { message: "Description must be at least 5 characters long." })
    .max(100, { message: "Description cannot exceed 100 characters." })
    .optional(),
});


export const updateTransactionZodSchema = z.object({
  walletId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid wallet Id",
  }),

//   transactionType: z.enum(Object.values(TransactionType) as [string]),

//   transactionStatus: z.enum(Object.values(TransactionStatus) as [string]),


});
