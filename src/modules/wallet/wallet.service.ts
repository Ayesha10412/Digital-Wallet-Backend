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
const addMoneyToWallet = async (userId: string, amount: number) => {
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

//withdraw money
const withdrawMoney = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");
  }
  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount is less than balance!");
  }
  wallet.balance -= amount;
  await wallet.save();
  await Transaction.create({
    fromUser: userId,
    amount,
    type: TransactionType.WITHDRAW,
    status: TransactionStatus.COMPLETED,
  });
  return wallet;
};

export const WalletServices = { createWallet, withdrawMoney, addMoneyToWallet };
