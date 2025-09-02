import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);
export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
