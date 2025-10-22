import { NextFunction, Request, Response } from "express";
import AppError from "../modules/errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { Status } from "../modules/user/user.interface";
import { AuthUser } from "../modules/Interfaces";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "No token received!");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload & AuthUser;
      const isUserExist = await User.findOne({ email: verifiedToken.email });
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
      }
      if (
        isUserExist?.status === Status.BLOCKED ||
        isUserExist?.status === Status.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.status}!`
        );
      }
      if (isUserExist?.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(405, "You're not permitted to view this route!");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
