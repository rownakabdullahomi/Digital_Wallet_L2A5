import { Types } from "mongoose";

// Only for users
export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  userId: Types.ObjectId;
  balance: number;
  walletStatus?: WalletStatus;
}
