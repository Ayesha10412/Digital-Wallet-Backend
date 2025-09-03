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

const sendMoney = async (
  fromUserId: string,
  toUserId: string,
  amount: number
) => {
  if (fromUserId === toUserId)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot send money to yourself!"
    );
  const senderWallet = await Wallet.findOne({ owner: fromUserId });
  const receiverWallet = await Wallet.findOne({ owner: toUserId });
  console.log(senderWallet);
  console.log("receiverWallet", receiverWallet);
  if (!senderWallet || !receiverWallet)
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");

  if (senderWallet.balance < amount)
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!");
  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  await senderWallet.save();
  await receiverWallet.save();
  await Transaction.create({
    fromUser: fromUserId,
    toUser: toUserId,
    amount,
    type: TransactionType.SEND,
    status: TransactionStatus.COMPLETED,
  });
  return { senderWallet, receiverWallet };
};
//cash-in(agent/admin adds to user)
const cashIn = async (agentId: string, userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not Found!");
  }
  wallet.balance += amount;
  await wallet.save();
  await Transaction.create({
    fromUser: agentId,
    toUser: userId,
    amount,
    type: TransactionType.CASH_IN,
    status: TransactionStatus.COMPLETED,
  });
  return wallet;
};
//cash-out(Agent/admin withdraws from user)
const cashOutMoney = async (
  agentId: string,
  userId: string,
  amount: number
) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");
  }
  if (wallet.balance < amount)
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!");
  wallet.balance -= amount;
  await wallet.save();
  await Transaction.create({
    fromUser: userId,
    toUser: agentId,
    amount,
    type: TransactionType.CASH_OUT,
    status: TransactionStatus.COMPLETED,
  });
  return wallet;
};
export const WalletServices = {
  createWallet,
  sendMoney,
  withdrawMoney,
  addMoneyToWallet,
  cashIn,
  cashOutMoney,
};
