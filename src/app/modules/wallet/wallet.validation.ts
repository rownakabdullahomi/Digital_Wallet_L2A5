import { z } from "zod";
import { WalletStatus } from "./wallet.interface";
import mongoose from "mongoose";

export const createWalletZodSchema = z.object({
  userId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid userId",
    }),
  balance: z
    .number()
    .min(0, { message: "Balance cannot be negative" }),
  walletStatus: z
    .enum(Object.values(WalletStatus) as [string])
    .default(WalletStatus.ACTIVE),
});


export const updateWalletZodSchema = z.object({
  balance: z
    .number()
    .min(0, { message: "Balance cannot be negative" })
    .optional(),
  walletStatus: z
    .enum(Object.values(WalletStatus) as [string])
    .optional(),
});
