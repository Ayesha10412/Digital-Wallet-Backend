import mongoose from "mongoose";

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export interface IAuthProviders {
  provider: "google" | "credentials";
  providerId: string;
}
export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  Status?: Status;
  isVerified?: boolean;
  role: ROLE;
  auths: IAuthProviders[];
  walletId?: mongoose.Types.ObjectId;
  isApproved?: boolean;
  commissionRate?: number;
}
