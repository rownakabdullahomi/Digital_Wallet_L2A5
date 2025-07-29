import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";

const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: `✅ Transaction created successfully`,
      transaction,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: `Something went wrong ! ${error}`,
    });
  }
};

export const TransactionController = {
  createTransaction,
};
