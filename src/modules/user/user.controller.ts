import { NextFunction, Request, Response } from "express";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const UserControllers = {
  createUser,
};
