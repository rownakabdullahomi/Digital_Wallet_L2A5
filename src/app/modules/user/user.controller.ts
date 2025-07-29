import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";



const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            success: true,
            message: `✅ User created successfully.`,
            user,
        })

    } catch (error) {
        next(error);
    }
}

export const UserController = {
    createUser
}