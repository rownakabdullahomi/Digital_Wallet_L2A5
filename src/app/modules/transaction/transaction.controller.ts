import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";


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
const addMoneyForAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.params.userId;
    const payload = req.body;

    const transaction = await TransactionService.addMoneyForAgent(agentId, payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Add money to agent wallet successfully`,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
const cashInOutRequestFromUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.cashInOutRequestFromUser(payload, decodedToken);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ ${payload.transactionType} request placed successfully`,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
const cashInOutApprovalFromAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.cashInOutApprovalFromAgent(payload, decodedToken);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Transaction done and update user wallet successfully`,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
const sendMoney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.sendMoney(payload, decodedToken);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Send money successful`,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
const transactionsByWalletId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walletId = req.params.walletId;
    const transactionHistory = await TransactionService.transactionsByWalletId(walletId.toString());

    res.status(httpStatus.OK).json({
      success: true,
      message: `✅ Transaction history gained successfully.`,
      transactionHistory,
    });
  } catch (error) {
    next(error);
  }
};
const allTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allTransactionHistory = await TransactionService.allTransactions();

    res.status(httpStatus.OK).json({
      success: true,
      message: `✅ All transaction history gained successfully.`,
      allTransactionHistory,
    });
  } catch (error) {
    next(error);
  }
};


export const TransactionController = {
  // createTransaction,
  addMoneyForAgent,
  cashInOutRequestFromUser,
  cashInOutApprovalFromAgent,
  sendMoney,
  transactionsByWalletId,
  allTransactions,
};
