/* eslint-disable @typescript-eslint/no-explicit-any */

import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { validateUserById } from "../../utils/validateUserById";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist)
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");


//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched)
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");

//     const userTokens = createUserTokens(isUserExist)


//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const {password: _password, ...rest} = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
 
    // const isUserExist = await User.findById(decodedToken.userId)
    const isUserExist = await validateUserById(decodedToken.userId)

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}

export const AuthService = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword
};
