/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";
import { Transaction } from "./transaction.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "../wallet/wallet.model";
import { validateUserById } from "../../utils/validateUserById";
import { JwtPayload } from "jsonwebtoken";

// const createTransaction = async (payload: Partial<ITransaction>) => {
//     const transaction = await Transaction.create(payload);
//     return transaction;
// }

/// Agent -> add money from admin
const addMoneyForAgent = async (payload: {
  agentId: string;
  body: Partial<ITransaction>;
}) => {
  const { agentId, body } = payload;

  const { transactionAmount, transactionType, transactionStatus, description } =
    body;

  // 1. Validate required fields
  if (!agentId || !transactionAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  // 2. Validate agent using reusable utility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const agent = await validateUserById(agentId);

  // 3. Find the agent's wallet
  const wallet = await Wallet.findOne({ userId: agentId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet for this user not found");
  }

  // 4. Create the transaction
  const newTransaction = await Transaction.create({
    walletId: wallet._id,
    transactionType: transactionType || TransactionType.ADD_MONEY,
    transactionAmount,
    transactionStatus: transactionStatus || TransactionStatus.APPROVED,
    description: description || "Agent add money",
  });

  // 5. Update wallet balance
  wallet.balance += transactionAmount;
  await wallet.save();

  return newTransaction;
};

/// User -> add money and cash out from agent
const cashInOutRequestFromUser = async (
  userId: string,
  payload: Partial<ITransaction>,
  decodedToken: JwtPayload
) => {
  const { transactionType, transactionAmount, description, agentId } = payload;

  // 1. Validate input
  if (!transactionType || !transactionAmount || !agentId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  // 2. Validate user and agent using reusable utility
  // const user = await validateUserById(userId);
  // const agent = await validateUserById(agentId);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, agent] = await Promise.all([
    validateUserById(decodedToken.userId),
    validateUserById(agentId.toString()),
  ]);

  // 3. Ensure agent role
  if (agent.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent is not valid");
  }

  // 4. Find wallets
  const userWallet = await Wallet.findOne({ userId });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }

  // 6. Check if user already has a pending request of the same type
  const existingPending = await Transaction.findOne({
    walletId: userWallet._id,
    transactionStatus: TransactionStatus.PENDING,
  });

  if (existingPending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You already have a pending ${transactionType} request`
    );
  }

  // 7. Create transaction
  const transactionRequest = await Transaction.create({
    walletId: userWallet._id,
    transactionType,
    transactionAmount,
    transactionStatus: TransactionStatus.PENDING,
    description: description || `${transactionType} request from user to agent`,
    agentId: agent._id,
  });

  return transactionRequest;
};

/// Approve user request by an agent
const cashInOutApprovalFromAgent = async (
  agentId: string,
  payload: Partial<ITransaction>,
  decodedToken: JwtPayload
) => {
  const { walletId: userWalletId } = payload;

  // 1. Validate input
  if (!userWalletId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing user wallet Id");
  }

  const agent = await validateUserById(decodedToken.userId);

  // 2. Ensure agent role
  if (agent.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent is not valid");
  }

  // 3. Find wallets
  const userWallet = await Wallet.findOne({ _id: userWalletId });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }
  const agentWallet = await Wallet.findOne({ userId: agent._id });

  if (!agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
  }

  // 4. Find the user's pending transaction to this agent
  const pendingTransaction = await Transaction.findOne({
    walletId: userWalletId,
    agentId: agent._id,
    transactionStatus: TransactionStatus.PENDING,
  });

  if (!pendingTransaction) {
    throw new AppError(httpStatus.NOT_FOUND, "No pending request found");
  }

  const { transactionType, transactionAmount, description } =
    pendingTransaction;

  // 5. Perform balance update logic
  if (transactionType === TransactionType.ADD_MONEY) {
    if (agentWallet.balance < transactionAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Agent has insufficient balance"
      );
    }

    agentWallet.balance -= transactionAmount;
    userWallet.balance += transactionAmount;
  }

  if (transactionType === TransactionType.WITHDRAW) {
    if (userWallet.balance < transactionAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User has insufficient balance"
      );
    }

    userWallet.balance -= transactionAmount;
    agentWallet.balance += transactionAmount;
  }

  // 6. Save wallets
  await Promise.all([agentWallet.save(), userWallet.save()]);

  // 7. Update transaction
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    pendingTransaction._id,
    {
      transactionStatus: TransactionStatus.APPROVED,
      description:
        description ||
        `${transactionType} request approved successfully by agent`,
    },
    {
    new: true,
    runValidators: true,
  }
  );

  return updatedTransaction;
};

export const TransactionService = {
  // createTransaction
  addMoneyForAgent,
  cashInOutRequestFromUser,
  cashInOutApprovalFromAgent,
};
