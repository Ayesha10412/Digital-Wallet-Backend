import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

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
    currency: {
      type: String,
      default: "BDT",
    },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  { timestamps: true, versionKey: false }
);
export const Wallet = model<IWallet>("Wallet", walletSchema);
