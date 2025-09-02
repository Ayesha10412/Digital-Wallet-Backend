import mongoose from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: mongoose.Types.ObjectId;
  balance: number;
  owner: mongoose.Types.ObjectId;
  currency?: string;
  status?: WalletStatus;
}
