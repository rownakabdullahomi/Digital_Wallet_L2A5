import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";

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
const addMoneyForAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.userId;
  const payload = req.body;

  const transaction = await TransactionService.addMoneyForAgent(
    agentId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `✅ Add money to agent wallet successfully`,
    data: transaction,
  });
});

const cashInOutRequestFromUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const decodedToken = req.user;

    const transaction = await TransactionService.cashInOutRequestFromUser(
      payload,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `✅ ${payload.transactionType} request placed successfully`,
      data: transaction,
    });
  }
);
const cashInOutApprovalFromAgent = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const decodedToken = req.user;

    const transaction = await TransactionService.cashInOutApprovalFromAgent(
      payload,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "✅ Transaction done and update user wallet successfully",
      data: transaction,
    });
  }
);

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const decodedToken = req.user;

  const transaction = await TransactionService.sendMoney(
    payload,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "✅ Send money successful.",
    data: transaction,
  });
});
const transactionsByWalletId = catchAsync(
  async (req: Request, res: Response) => {
    const walletId = req.params.walletId;
    const result = await TransactionService.transactionsByWalletId(
      walletId.toString()
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
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
  }
);
const allTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TransactionService.allTransactions(
    query as Record<string, string>
  );
  // const result = await TransactionService.allTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
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
});

export const TransactionController = {
  // createTransaction,
  addMoneyForAgent,
  cashInOutRequestFromUser,
  cashInOutApprovalFromAgent,
  sendMoney,
  transactionsByWalletId,
  allTransactions,
};
