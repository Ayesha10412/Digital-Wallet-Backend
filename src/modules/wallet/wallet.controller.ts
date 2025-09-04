/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const { amount } = req.body;
    const wallet = await WalletServices.addMoneyToWallet(userId, amount);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Money added successfully!",
      data: wallet,
    });
  }
);

const withdrawMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    //console.log(req.user);
    const { amount } = req.body;
    const wallet = await WalletServices.withdrawMoney(userId, amount);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Money withdrawn successfully!",
      data: wallet,
    });
  }
);
const sendMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const fromUserId = req.user!.userId;
    // console.log(fromUserId);
    const { toUserId, amount } = req.body;
    const result = await WalletServices.sendMoney(fromUserId, toUserId, amount);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Money send successfully!",
      data: result,
    });
  }
);

//cash-in(agent/admin adds to user)
const cashIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.user!.userId;
    //console.log(agentId);
    const { userId, amount } = req.body;
    const wallet = await WalletServices.cashIn(agentId, userId, amount);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cash-In successfully!",
      data: wallet,
    });
  }
);
const cashOutMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.user!.userId;
    //console.log(agentId);
    const { userId, amount } = req.body;
    const wallet = await WalletServices.cashOutMoney(agentId, userId, amount);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cash-Out successfully!",
      data: wallet,
    });
  }
);

const getWalletBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const wallet = await WalletServices.getWalletBalance(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Wallet balanced fetched!",
      data: wallet,
    });
  }
);
const getTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const wallet = await WalletServices.getTransactionHistory(userId!);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Transaction history fetched!",
      data: wallet,
    });
  }
);

export const WalletControllers = {
  addMoney,
  cashIn,
  withdrawMoney,
  sendMoney,
  cashOutMoney,
  getWalletBalance,
  getTransactionHistory,
};
