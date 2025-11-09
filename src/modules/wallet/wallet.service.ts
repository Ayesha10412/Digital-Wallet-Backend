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
import { User } from "../user/user.model";
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

//get only name and email of all users
const getRecipients = async (currentUserId: string) => {
  const recipients = await User.find(
    { _id: { $ne: currentUserId }, role: "USER", status: "ACTIVE" },
    "name email"
  );
  //console.log(recipients);
  return recipients;
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
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Transaction started!");
  try {
    const senderWallet = await Wallet.findOne({ owner: fromUserId }).session(
      session
    );
    const receiverWallet = await Wallet.findOne({ owner: toUserId }).session(
      session
    );
    console.log(senderWallet);
    console.log("receiverWallet", receiverWallet);
    if (!senderWallet || !receiverWallet)
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");

    if (senderWallet.balance < amount)
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!");
    //update balance
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    console.log("update balances");
    //save both in the same transaction
    await senderWallet.save({ session });
    await receiverWallet.save({ session });
    console.log("save both");
    //create the transaction record inside same session
    await Transaction.create(
      [
        {
          fromUser: fromUserId,
          toUser: toUserId,
          amount,
          type: TransactionType.SEND,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );
    console.log("created successfully");
    //commit transaction (apply all)
    await session.commitTransaction();
    console.log("commited");
    session.endSession();
    return { senderWallet, receiverWallet };
  } catch (error) {
    //roll back all if any step fails
    await session.abortTransaction();
    throw error;
  }
};
//cash-in(agent/admin adds to user)
const cashIn = async (agentId: string, userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not Found!");
  }
  //get agent commission
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== "AGENT" || !agent.isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent not authorized!");
  }
  wallet.balance += amount;
  await wallet.save();
  //apply commission
  const commission = agent.commissionRate
    ? (amount * agent.commissionRate) / 100
    : 0;
  if (commission > 0) {
    const agentWallet = await Wallet.findOne({ owner: userId });
    if (agentWallet) {
      agentWallet.balance += commission;
      await agentWallet.save();
    }
  }
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
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== "AGENT" || !agent.isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent not authorized!");
  }

  wallet.balance -= amount;
  await wallet.save();
  //apply commission
  const commission = agent.commissionRate
    ? (amount * agent.commissionRate) / 100
    : 0;
  if (commission > 0) {
    const agentWallet = await Wallet.findOne({ owner: agentId });
    if (agentWallet) {
      agentWallet.balance += commission;
      await agentWallet.save();
    }
  }
  await Transaction.create({
    fromUser: userId,
    toUser: agentId,
    amount,
    type: TransactionType.CASH_OUT,
    status: TransactionStatus.COMPLETED,
    commission,
  });
  return wallet;
};

//get wallet balance
const getWalletBalance = async (userId: string) => {
  const wallet = await Wallet.findOne({ owner: userId });
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found!");
  }
  return wallet;
};

//get transaction history
const getTransactionHistory = async (userId: string) => {
  return await Transaction.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
  }).sort({ createdAt: -1 });
};
export const WalletServices = {
  createWallet,
  sendMoney,
  withdrawMoney,
  addMoneyToWallet,
  cashIn,
  cashOutMoney,
  getWalletBalance,
  getTransactionHistory,
  getRecipients,
};
