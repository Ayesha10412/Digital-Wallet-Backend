import mongoose from "mongoose";
import AppError from "../errorHelpers/AppError";
import { Transaction } from "./transaction.model";
import httpStatus from "http-status-codes";
const getOwnTransaction = async (userId: string) => {
  return await Transaction.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
  }).sort({ createdAt: -1 });
};

const getAllTransaction = async () => {
  return await Transaction.find().sort({ createdAt: -1 });
};
const getTransactionById = async (id: string, userId: string, role: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid transaction id");
  }

  //const transaction = await Transaction.findById(id);
  const transaction = await Transaction.findById(id).lean();
  // console.log("DB Query Result:", transaction);

  if (!transaction)
    throw new AppError(httpStatus.BAD_REQUEST, "Transaction not found!");
  if (
    role !== "ADMIN" &&
    transaction.fromUser?.toString() !== userId &&
    transaction.toUser?.toString() !== userId
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view");
  }
  return transaction;
};
export const TransactionServices = {
  getOwnTransaction,
  getAllTransaction,
  getTransactionById,
};
