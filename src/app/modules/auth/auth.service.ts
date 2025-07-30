import AppError from "../../error/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import envVars from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password
  );

  if (!isPasswordMatched)
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  //   const accessToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {expiresIn: envVars.JWT_ACCESS_EXPIRES} as SignOptions)


  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  credentialsLogin,
};
