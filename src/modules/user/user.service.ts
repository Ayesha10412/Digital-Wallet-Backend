/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../errorHelpers/AppError";
import { IAuthProviders, IUser, ROLE } from "./user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "./user.model";
import { WalletServices } from "../wallet/wallet.service";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
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
  const wallet = await WalletServices.createWallet({
    balance: 50,
    owner: new mongoose.Types.ObjectId(user._id),
  });
  user.walletId = wallet._id;
  await user.save();
  return user;
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (payload.role) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }
  if (payload.role === ROLE.ADMIN && decodedToken.role === ROLE.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
  }
  if (payload.status || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
const getOwnProfile = async (email: string) => {
  return await User.findOne({ email });
};

const updateOwnProfile = async (id: string, payload: any) => {
  delete payload.role;
  delete payload.walletId;
  delete payload.status;
  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
};

export const UserServices = {
  createUser,
  getOwnProfile,
  updateUser,
  getAllUsers,
  updateOwnProfile,
};
