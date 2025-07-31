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
    const body = req.body;
    const payload = {
      agentId,
      body
    }
    const transaction = await TransactionService.addMoneyForAgent(payload);

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
    const userId = req.params.userId;
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.cashInOutRequestFromUser(userId, payload, decodedToken);

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
    const agentId = req.params.userId;
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.cashInOutApprovalFromAgent(agentId, payload, decodedToken);

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
    const senderId = req.params.userId;
    const payload = req.body;
    const decodedToken = req.user;
    
    const transaction = await TransactionService.sendMoney(senderId, payload, decodedToken);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Send money successful`,
      transaction,
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
};
