import mongoose from "mongoose";
import AppError from "../errorHelpers/AppError";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";
const createWallet = async (payload: Partial<IWallet>) => {
  const wallet = await Wallet.create(payload);
  return wallet;
};
export const addMoneyToWallet = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({
    owner: new mongoose.Types.ObjectId(userId),
  });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");
  }
  if (wallet.status === "BLOCKED") {
    throw new Error("Wallet is blocked!");
  }
  wallet.balance += amount;
  await wallet.save();
  await Transaction.create({
    toUser: userId,
    amount,
    type: TransactionType.DEPOSIT,
    status: TransactionStatus.COMPLETED,
  });
  return wallet;
};
export const WalletServices = { createWallet, addMoneyToWallet };
