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
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
// const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const transaction = await TransactionService.createTransaction(req.body);
//     res.status(httpStatus.CREATED).json({
//       success: true,
//       message: `✅ Transaction created successfully`,
//       transaction,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const addMoneyForAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.params.userId;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionService.addMoneyForAgent(agentId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `✅ Add money to agent wallet successfully`,
        data: transaction,
    });
}));
const cashInOutRequestFromUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionService.cashInOutRequestFromUser(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `✅ ${payload.transactionType} request placed successfully`,
        data: transaction,
    });
}));
const cashInOutApprovalFromAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionService.cashInOutApprovalFromAgent(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ Transaction done and update user wallet successfully",
        data: transaction,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionService.sendMoney(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ Send money successful.",
        data: transaction,
    });
}));
const transactionsByWalletId = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.walletId;
    const result = yield transaction_service_1.TransactionService.transactionsByWalletId(walletId.toString());
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ All transaction history gained successfully.",
        data: result.data,
        meta: result.meta,
    });
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: `✅ Transaction history gained successfully.`,
    //   transactionHistory,
    // });
}));
const allTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield transaction_service_1.TransactionService.allTransactions(query);
    // const result = await TransactionService.allTransactions();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ All transaction history gained successfully.",
        data: result.data,
        meta: result.meta,
    });
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: ``,
    //   allTransactionHistory,
    // });
}));
exports.TransactionController = {
    // createTransaction,
    addMoneyForAgent,
    cashInOutRequestFromUser,
    cashInOutApprovalFromAgent,
    sendMoney,
    transactionsByWalletId,
    allTransactions,
};
