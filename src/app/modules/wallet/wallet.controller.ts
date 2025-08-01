/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WallerService } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';


const updateWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.walletId;
    const payload = req.body;
    const wallet = await WallerService.updateWallet(walletId, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "✅ User wallet status changed successfully.",
      data: wallet,
    });
  }
);

export const WalletController = {
    updateWallet,
}