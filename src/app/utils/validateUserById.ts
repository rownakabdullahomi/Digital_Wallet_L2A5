
import AppError from "../error/AppError";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const validateUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    user.isActive !== "ACTIVE" ||
    // user.isVerified !== true ||
    user.isDeleted === true
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not valid");
  }

  return user; 
};
