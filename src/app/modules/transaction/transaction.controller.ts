import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";

const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Transaction created successfully`,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const TransactionController = {
  createTransaction,
};
