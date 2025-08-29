/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../errorHelpers/AppError";
import { IAuthProviders, IUser } from "./user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "./user.model";
import { Wallet } from "../wallet/wallet.model";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist!!");
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: email!,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  console.log(user);
  const wallet = await Wallet.create({ balance: 50, owner: user._id });
  user.walletId = wallet._id;
  await user.save();
  return user;
};
export const UserServices = { createUser };
