import mongoose from "mongoose";

export interface IWallet {
  balance: number;
  owner: mongoose.Types.ObjectId;
}
