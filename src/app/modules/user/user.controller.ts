/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

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
    })
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: `✅ All users retrieved successfully.`,
    //   users,
    // });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "✅ All users retrieved successfully.",
        data: users.data,
        meta: users.meta,
    })
});

export const UserController = {
  createUser,
  getAllUsers,
};
