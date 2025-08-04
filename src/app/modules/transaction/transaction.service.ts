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
import { IsAgentApproved } from "../user/user.interface";
import { WalletStatus } from "../wallet/wallet.interface";
import { CommissionRate } from "../commissionRate/commissionRate.model";
import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionSearchFields } from "./transaction.constant";

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

  if (agent.isAgentApproved === IsAgentApproved.SUSPENDED)
    throw new AppError(httpStatus.FORBIDDEN, "Agent is suspended!");

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

  const [user, agent] = await Promise.all([
    validateUserById(decodedToken.userId),
    validateUserById(agentId.toString()),
  ]);

  // 3. Ensure agent role
  if (agent.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent is not valid");
  }
  if (agent.isAgentApproved === IsAgentApproved.SUSPENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent is suspended!");
  }

  // 4. Find wallets
  const userWallet = await Wallet.findOne({ userId: user._id });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }

  // Check wallet is blocked or not
  if (userWallet.walletStatus === WalletStatus.BLOCKED)
    throw new AppError(httpStatus.NOT_FOUND, "User wallet is blocked");

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
  payload: Partial<ITransaction>,
  decodedToken: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let pendingTransaction: ITransaction | null = null;

  try {
    const { walletId: userWalletId } = payload;

    if (!userWalletId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Missing user wallet Id");
    }

    const agent = await validateUserById(decodedToken.userId);

    if (agent.role !== "AGENT") {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent is not valid");
    }

    if (agent.isAgentApproved === IsAgentApproved.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent is suspended!");
    }

    const userWallet = await Wallet.findOne({ _id: userWalletId }).session(
      session
    );
    if (!userWallet)
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");

    if (userWallet.walletStatus === WalletStatus.BLOCKED)
      throw new AppError(httpStatus.NOT_FOUND, "User wallet is blocked");

    const agentWallet = await Wallet.findOne({ userId: agent._id }).session(
      session
    );
    if (!agentWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");

    pendingTransaction = await Transaction.findOne({
      walletId: userWalletId,
      agentId: agent._id,
      transactionStatus: TransactionStatus.PENDING,
    }).session(session);

    if (!pendingTransaction) {
      throw new AppError(httpStatus.NOT_FOUND, "No pending request found");
    }

    const { transactionType, transactionAmount, description } =
      pendingTransaction;

    const commissionRateData = await CommissionRate.findOne().session(session);
    if (!commissionRateData)
      throw new AppError(httpStatus.NOT_FOUND, "Commission rate not found");

    const commission = transactionAmount * commissionRateData.rate;

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
      if (userWallet.balance < transactionAmount + commission) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User has insufficient balance"
        );
      }

      pendingTransaction.transactionAmount += commission;
      userWallet.balance -= transactionAmount + commission;
      agentWallet.balance += transactionAmount + commission;
    }

    await Promise.all([
      agentWallet.save({ session }),
      userWallet.save({ session }),
    ]);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      pendingTransaction._id,
      {
        transactionAmount: pendingTransaction.transactionAmount,
        commissionAmount: commission,
        transactionStatus: TransactionStatus.APPROVED,
        description:
          description ||
          `${transactionType} request approved successfully by agent`,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedTransaction;
  } catch (error) {
    if (pendingTransaction) {
      //  REVERSED
      await Transaction.findByIdAndUpdate(
        pendingTransaction._id,
        {
          transactionStatus: TransactionStatus.REVERSED,
          description: "Transaction was reversed due to an internal error.",
        },
        { session }
      );
    }

    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

/// User -> send money to another user
const sendMoney = async (
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

  // Check wallet is blocked or not
  if (receiverWallet.walletStatus === WalletStatus.BLOCKED)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet is blocked");

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
  // Check wallet is blocked or not
  if (senderWallet.walletStatus === WalletStatus.BLOCKED)
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet is blocked");

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

/// View all transactions of an specific walletId
const transactionsByWalletId = async (decodedToken: JwtPayload) => {
  const userId = await validateUserById(decodedToken.userId);
  const wallet = await Wallet.findOne({userId})
  if(!wallet) throw new AppError(httpStatus.NOT_FOUND, "No wallet found of this user.")
  const transactionHistory = await Transaction.find({ walletId: wallet._id });
  const totalTransactions = await Transaction.countDocuments({ walletId: wallet._id });

  return {
    data: transactionHistory,

    meta: {
      total: totalTransactions,
    },
  };

  // return transactionHistory;
};

/// Admin -> All transactions history
const allTransactions = async (query: Record<string, string>) => {
  // const allTransactionHistory = await Transaction.find();

  const queryBuilder = new QueryBuilder(Transaction.find(), query);

  const transactions = await queryBuilder
    .search(transactionSearchFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactions.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const TransactionService = {
  // createTransaction
  addMoneyForAgent,
  cashInOutRequestFromUser,
  cashInOutApprovalFromAgent,
  sendMoney,
  transactionsByWalletId,
  allTransactions,
};
