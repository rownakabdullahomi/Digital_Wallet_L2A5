/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { AuthService } from "./auth.service";
import AppError from "../../error/AppError";
import { setAuthCookie } from "../../utils/setCookie";


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const loginInfo = await AuthService.credentialsLogin(req.body);
   
    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "✅ User logged in successfully.",
        data: loginInfo,
    })
});

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token from cookies"
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Get Successfully",
      data: tokenInfo,
    });
  }
);

export const AuthController = {
    credentialsLogin,
    getNewAccessToken
}