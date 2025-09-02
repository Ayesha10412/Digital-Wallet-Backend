/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from "express";
import { WalletServices } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../errorHelpers/AppError";
const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    console.log(req.user);
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
export const WalletControllers = { addMoney };
