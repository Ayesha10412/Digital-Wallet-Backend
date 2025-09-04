/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
const getOwnTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const transaction = await TransactionServices.getOwnTransaction(userId!);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transaction history fetched!",
      data: transaction,
    });
  }
);
const getAllTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await TransactionServices.getAllTransaction();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All transactions retrieved successfully!",
      data: transaction,
    });
  }
);
const getTransactionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;
    console.log("req.user in controller:", req.user);
    console.log("params.id:", req.params.id);
    console.log("userId:", req.user?.userId, "role:", req.user?.role);

    const transaction = await TransactionServices.getTransactionById(
      id!,
      userId,
      role
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transactions retrieved successfully!",
      data: transaction,
    });
  }
);
export const TransactionController = {
  getOwnTransaction,
  getAllTransaction,
  getTransactionById,
};
