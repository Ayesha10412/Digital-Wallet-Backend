import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    balance: {
      type: Number,
      required: true,
      default: 50,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
export const Wallet = model<IWallet>("Wallet", walletSchema);
