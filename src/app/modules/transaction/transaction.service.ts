/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import AppError from "../../error/AppError";
import httpStatus from 'http-status-codes';
import { Wallet } from "../wallet/wallet.model";

// const createTransaction = async (payload: Partial<ITransaction>) => {
//     const transaction = await Transaction.create(payload);
//     return transaction;
// }

const addMoneyForAgent = async (payload: {
  agentId: string; // now using userId instead of walletId
  body: Partial<ITransaction>;
}) => {
  const { agentId, body } = payload;

  const {
    transactionAmount,
    transactionType,
    transactionStatus,
    description,
  } = body;

  // 1. Validate required fields
  if (!agentId || !transactionAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  // 2. Find the agent's wallet by userId
  const wallet = await Wallet.findOne({ userId: agentId }).populate("userId");

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet for this user not found");
  }

  const user = wallet.userId as any;

  // 3. Ensure the user is an AGENT
  if (user.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "Target user is not an agent");
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






export const TransactionService = {
    // createTransaction
    addMoneyForAgent
}