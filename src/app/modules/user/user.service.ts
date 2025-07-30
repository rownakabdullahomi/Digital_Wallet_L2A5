import AppError from "../../error/AppError";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import envVars from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists.");

  const hashedPassword = await bcryptjs.hash(password as string, envVars.BCRYPT_SALT_ROUND);

  const authProvider: IAuthProvider = {
    provider: "Credentials",
    providerId: email as string,
  };

  //> Step 1: Create the user
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  //> Step 2: Create wallet with initial balance (৳50)
  const wallet = await Wallet.create({
    userId: user._id,
    balance: 50,
  });

  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  //> Step 3: Create initial transaction for opening balance
  await Transaction.create({
    userId: user._id,
    walletId: wallet._id,
    transactionType: TransactionType.ADD_MONEY,
    transactionStatus: TransactionStatus.APPROVED,
    transactionAmount: 50,
    description: "Initial wallet creation balance",
  });

  //> Step 4: Update user's walletId
  user.walletId = wallet._id;
  await user.save();

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserService = {
  createUser,
  getAllUsers,
};
