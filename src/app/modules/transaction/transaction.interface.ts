import { Types } from "mongoose";

export enum TransactionType {
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW = "WITHDRAW",
  SEND_MONEY = "SEND_MONEY",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  REVERSED = "REVERSED",
  DONE = "DONE",
}

export interface ITransaction {
  _id: Types.ObjectId;
  walletId: Types.ObjectId; // Whose wallet was used
  transactionType: TransactionType;
  transactionAmount: number;
  transactionStatus: TransactionStatus;

  // for SEND_MONEY
  agentId?: Types.ObjectId;
  //  for commission
  commissionAmount?: number;
  // ADD MONEY of user
  receiverId?: Types.ObjectId;

  // Optional: status & meta info
  description?: string;
}
