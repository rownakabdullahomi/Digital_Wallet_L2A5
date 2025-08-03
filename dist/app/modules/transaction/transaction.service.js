"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_interface_1 = require("./transaction.interface");
const transaction_model_1 = require("./transaction.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_model_1 = require("../wallet/wallet.model");
const validateUserById_1 = require("../../utils/validateUserById");
const user_interface_1 = require("../user/user.interface");
const wallet_interface_1 = require("../wallet/wallet.interface");
const commissionRate_model_1 = require("../commissionRate/commissionRate.model");
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const transaction_constant_1 = require("./transaction.constant");
// const createTransaction = async (payload: Partial<ITransaction>) => {
//     const transaction = await Transaction.create(payload);
//     return transaction;
// }
/// Agent -> add money from admin
const addMoneyForAgent = (agentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionAmount, transactionType, transactionStatus, description } = payload;
    // 1. Validate required fields
    if (!agentId || !transactionAmount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing required fields");
    }
    // 2. Validate agent using reusable utility
    const agent = yield (0, validateUserById_1.validateUserById)(agentId);
    if (agent.isAgentApproved === user_interface_1.IsAgentApproved.SUSPENDED)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Agent is suspended!");
    // 3. Find the agent's wallet
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: agent._id });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet for this agent not found");
    }
    // 4. Create the transaction
    const newTransaction = yield transaction_model_1.Transaction.create({
        walletId: wallet._id,
        transactionType: transactionType || transaction_interface_1.TransactionType.ADD_MONEY,
        transactionAmount,
        transactionStatus: transactionStatus || transaction_interface_1.TransactionStatus.APPROVED,
        description: description || "Agent add money",
    });
    // 5. Update wallet balance
    wallet.balance += transactionAmount;
    yield wallet.save();
    return newTransaction;
});
/// User -> add money and cash out request to agent
const cashInOutRequestFromUser = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionType, transactionAmount, description, agentId } = payload;
    // 1. Validate input
    if (!transactionType || !transactionAmount || !agentId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing required fields");
    }
    // 2. Validate user and agent using reusable utility
    // const user = await validateUserById(userId);
    // const agent = await validateUserById(agentId);
    const [user, agent] = yield Promise.all([
        (0, validateUserById_1.validateUserById)(decodedToken.userId),
        (0, validateUserById_1.validateUserById)(agentId.toString()),
    ]);
    // 3. Ensure agent role
    if (agent.role !== "AGENT") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is not valid");
    }
    if (agent.isAgentApproved === user_interface_1.IsAgentApproved.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is suspended!");
    }
    // 4. Find wallets
    const userWallet = yield wallet_model_1.Wallet.findOne({ userId: user._id });
    if (!userWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
    }
    // Check wallet is blocked or not
    if (userWallet.walletStatus === wallet_interface_1.WalletStatus.BLOCKED)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet is blocked");
    // 5. Check if user already has a pending request of the same type
    const existingPending = yield transaction_model_1.Transaction.findOne({
        walletId: userWallet._id,
        transactionStatus: transaction_interface_1.TransactionStatus.PENDING,
    });
    if (existingPending) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You already have a pending ${transactionType} request`);
    }
    // 6. Create transaction
    const transactionRequest = yield transaction_model_1.Transaction.create({
        walletId: userWallet._id,
        transactionType,
        transactionAmount,
        transactionStatus: transaction_interface_1.TransactionStatus.PENDING,
        description: description || `${transactionType} request from user to agent`,
        agentId: agent._id,
    });
    return transactionRequest;
});
/// Approves user request by an agent
const cashInOutApprovalFromAgent = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    let pendingTransaction = null;
    try {
        const { walletId: userWalletId } = payload;
        if (!userWalletId) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing user wallet Id");
        }
        const agent = yield (0, validateUserById_1.validateUserById)(decodedToken.userId);
        if (agent.role !== "AGENT") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is not valid");
        }
        if (agent.isAgentApproved === user_interface_1.IsAgentApproved.SUSPENDED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is suspended!");
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ _id: userWalletId }).session(session);
        if (!userWallet)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
        if (userWallet.walletStatus === wallet_interface_1.WalletStatus.BLOCKED)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet is blocked");
        const agentWallet = yield wallet_model_1.Wallet.findOne({ userId: agent._id }).session(session);
        if (!agentWallet)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
        pendingTransaction = yield transaction_model_1.Transaction.findOne({
            walletId: userWalletId,
            agentId: agent._id,
            transactionStatus: transaction_interface_1.TransactionStatus.PENDING,
        }).session(session);
        if (!pendingTransaction) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No pending request found");
        }
        const { transactionType, transactionAmount, description } = pendingTransaction;
        const commissionRateData = yield commissionRate_model_1.CommissionRate.findOne().session(session);
        if (!commissionRateData)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Commission rate not found");
        const commission = transactionAmount * commissionRateData.rate;
        if (transactionType === transaction_interface_1.TransactionType.ADD_MONEY) {
            if (agentWallet.balance < transactionAmount) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent has insufficient balance");
            }
            agentWallet.balance -= transactionAmount;
            userWallet.balance += transactionAmount;
        }
        if (transactionType === transaction_interface_1.TransactionType.WITHDRAW) {
            if (userWallet.balance < transactionAmount + commission) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User has insufficient balance");
            }
            pendingTransaction.transactionAmount += commission;
            userWallet.balance -= transactionAmount + commission;
            agentWallet.balance += transactionAmount + commission;
        }
        yield Promise.all([
            agentWallet.save({ session }),
            userWallet.save({ session }),
        ]);
        const updatedTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(pendingTransaction._id, {
            transactionAmount: pendingTransaction.transactionAmount,
            commissionAmount: commission,
            transactionStatus: transaction_interface_1.TransactionStatus.APPROVED,
            description: description ||
                `${transactionType} request approved successfully by agent`,
        }, {
            new: true,
            runValidators: true,
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return updatedTransaction;
    }
    catch (error) {
        if (pendingTransaction) {
            //  REVERSED
            yield transaction_model_1.Transaction.findByIdAndUpdate(pendingTransaction._id, {
                transactionStatus: transaction_interface_1.TransactionStatus.REVERSED,
                description: "Transaction was reversed due to an internal error.",
            }, { session });
        }
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
/// User -> send money to another user
const sendMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId: receiverWalletId, transactionType, transactionAmount, } = payload;
    // 1. Validate input
    if (!receiverWalletId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing receiver wallet Id");
    }
    if (!transactionAmount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Missing transaction amount");
    }
    if (transactionType !== transaction_interface_1.TransactionType.SEND_MONEY) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid transaction type");
    }
    const receiverWallet = yield wallet_model_1.Wallet.findById(receiverWalletId);
    if (!receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    }
    // Check wallet is blocked or not
    if (receiverWallet.walletStatus === wallet_interface_1.WalletStatus.BLOCKED)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet is blocked");
    const sender = yield (0, validateUserById_1.validateUserById)(decodedToken.userId);
    const receiver = yield (0, validateUserById_1.validateUserById)(receiverWallet.userId.toString());
    // 2. Ensure role
    if (sender.role !== "USER" || receiver.role !== "USER") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user role");
    }
    // 3. Find sender wallet
    const senderWallet = yield wallet_model_1.Wallet.findOne({ userId: sender._id });
    if (!senderWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
    }
    // Check wallet is blocked or not
    if (senderWallet.walletStatus === wallet_interface_1.WalletStatus.BLOCKED)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet is blocked");
    // 4. Perform balance update logic
    if (senderWallet.balance < transactionAmount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have insufficient balance");
    }
    senderWallet.balance -= transactionAmount;
    receiverWallet.balance += transactionAmount;
    // 5. Save wallets
    yield Promise.all([senderWallet.save(), receiverWallet.save()]);
    // 6. Save transaction
    const sendMoneyTransaction = yield transaction_model_1.Transaction.create({
        walletId: senderWallet._id,
        transactionAmount,
        transactionType: transaction_interface_1.TransactionType.SEND_MONEY,
        transactionStatus: transaction_interface_1.TransactionStatus.DONE,
        receiverUserId: receiverWallet.userId,
        receiverWalletId: receiverWallet._id,
        description: `${transactionType} request successfully completed`,
    });
    return sendMoneyTransaction;
});
/// View all transactions of an specific user
const transactionsByWalletId = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionHistory = yield transaction_model_1.Transaction.find({ walletId });
    const totalTransactions = yield transaction_model_1.Transaction.countDocuments({ walletId });
    return {
        data: transactionHistory,
        meta: {
            total: totalTransactions,
        },
    };
    // return transactionHistory;
});
/// Admin -> All transactions history
const allTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const allTransactionHistory = await Transaction.find();
    const queryBuilder = new QueryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(), query);
    const transactions = yield queryBuilder
        .search(transaction_constant_1.transactionSearchFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        transactions.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
exports.TransactionService = {
    // createTransaction
    addMoneyForAgent,
    cashInOutRequestFromUser,
    cashInOutApprovalFromAgent,
    sendMoney,
    transactionsByWalletId,
    allTransactions,
};
