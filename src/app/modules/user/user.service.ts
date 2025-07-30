import AppError from "../../error/AppError";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { Wallet } from "../wallet/wallet.model";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import envVars from "../../config/env";
import { isValidObjectId } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists.");

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

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

// const updateUserToAgent = async (userId: string) => {
//   if (!isValidObjectId(userId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
//   }

//   const isUserExist = await User.findById(userId);

//   if (!isUserExist)
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");

//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     {
//       role: "AGENT",
//       isAgentApproved: "APPROVED",
//     },
//     { new: true }
//   );

//   return {
//     data: updatedUser,
//   };
// };

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (!isValidObjectId(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!!");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!!");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
};
