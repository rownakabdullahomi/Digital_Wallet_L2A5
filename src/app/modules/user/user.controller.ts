/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await UserService.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             success: true,
//             message: `✅ User created successfully.`,
//             user,
//         })

//     } catch (error) {
//         next(error);
//     }
// }

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   message: `✅ User created successfully.`,
    //   user,
    // });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "✅ User created successfully.",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: `✅ All users retrieved successfully.`,
    //   users,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "✅ All users retrieved successfully.",
      data: users.data,
      meta: users.meta,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;

    const verifiedToken = req.user;

    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "✅ User successfully updated",
      data: user,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
