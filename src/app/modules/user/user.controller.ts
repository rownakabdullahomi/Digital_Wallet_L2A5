import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try {
       
        const user = await UserService.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            success: true,
            message: `User created successfully`,
            user,
        })

    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: `Something went wrong ! ${error}`
        })
    }
}

export const UserController = {
    createUser
}