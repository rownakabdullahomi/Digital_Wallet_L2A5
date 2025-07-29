import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: "Google" | "Credentials"; 
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name?: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  picture?: string;
  address?: string;
  auths: IAuthProvider[];

  //> Common for all
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;

  //> MongoDB Wallet reference
  walletId?: Types.ObjectId;

  //> Agent-specific fields
  isApproved?: boolean;
  commissionRate?: number;

}
