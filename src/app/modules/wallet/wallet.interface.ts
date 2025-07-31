import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  userId: Types.ObjectId;
  balance: number;
  walletStatus: WalletStatus;
}
