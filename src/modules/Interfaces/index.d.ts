import "express";

export interface AuthUser {
  _id?: string;
  userId: string;
  email: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}
