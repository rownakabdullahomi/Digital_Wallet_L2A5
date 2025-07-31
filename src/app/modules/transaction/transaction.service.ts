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
const addMoneyForAgent = async (
  agentId: string,
  payload: Partial<ITransaction>
) => {
  const { transactionAmount, transactionType, transactionStatus, description } =
    payload;

  // 1. Validate required fields
  if (!agentId || !transactionAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  // 2. Validate agent using reusable utility
  const agent = await validateUserById(agentId);

  // 3. Find the agent's wallet
  const wallet = await Wallet.findOne({ userId: agent._id });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet for this agent not found");
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

/// User -> add money and cash out request to agent
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

  // 5. Check if user already has a pending request of the same type
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

  // 6. Create transaction
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

/// Approves user request by an agent
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

/// User -> send money to another user
const sendMoney = async (
  senderId: string,
  payload: Partial<ITransaction>,
  decodedToken: JwtPayload
) => {
  const {
    walletId: receiverWalletId,
    transactionType,
    transactionAmount,
  } = payload;

  // 1. Validate input
  if (!receiverWalletId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing receiver wallet Id");
  }
  if (!transactionAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing transaction amount");
  }
  if (transactionType !== TransactionType.SEND_MONEY) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid transaction type");
  }

  const receiverWallet = await Wallet.findById(receiverWalletId);
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }

  const sender = await validateUserById(decodedToken.userId);
  const receiver = await validateUserById(receiverWallet.userId.toString());

  // 2. Ensure role
  if (sender.role !== "USER" || receiver.role !== "USER") {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  // 3. Find sender wallet
  const senderWallet = await Wallet.findOne({ userId: sender._id });
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
  }

  // 4. Perform balance update logic
  if (senderWallet.balance < transactionAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have insufficient balance");
  }

  senderWallet.balance -= transactionAmount;
  receiverWallet.balance += transactionAmount;

  // 5. Save wallets
  await Promise.all([senderWallet.save(), receiverWallet.save()]);

  // 6. Save transaction
  const sendMoneyTransaction = await Transaction.create({
    walletId: senderWallet._id,
    transactionAmount,
    transactionType: TransactionType.SEND_MONEY,
    transactionStatus: TransactionStatus.DONE,
    receiverUserId: receiverWallet.userId,
    receiverWalletId: receiverWallet._id,
    description: `${transactionType} request successfully completed`,
  });

  return sendMoneyTransaction;
};

/// View all transactions of an specific user
const transactionsByWalletId = async(walletId: string)=>{
const transactionHistory = await Transaction.find({walletId});

return transactionHistory;
}

/// Admin -> All transactions history
const allTransactions = async()=>{
const allTransactionHistory = await Transaction.find();
return allTransactionHistory
}

export const TransactionService = {
  // createTransaction
  addMoneyForAgent,
  cashInOutRequestFromUser,
  cashInOutApprovalFromAgent,
  sendMoney,
  transactionsByWalletId,
  allTransactions
};
