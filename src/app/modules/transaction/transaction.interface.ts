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
}

export interface ITransaction {
  walletId: Types.ObjectId; // Whose wallet was used
  transactionType: TransactionType;
  transactionAmount: number;
  transactionStatus: TransactionStatus;

  // for SEND_MONEY or ADD MONEY of user
  agentId?: Types.ObjectId;



  // Optional: status & meta info
  description?: string;
}
