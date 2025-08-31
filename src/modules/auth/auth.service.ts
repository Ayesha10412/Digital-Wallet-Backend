/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPassword = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match!");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
  return true;
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
};
