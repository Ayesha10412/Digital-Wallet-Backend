import { model, Schema } from "mongoose";
import { IAuthProviders, IUser, ROLE, Status } from "./user.interface";

const authProviderSchema = new Schema<IAuthProviders>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    picture: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    Status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    commissionRate: {
      type: Number,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    auths: [authProviderSchema],
  },
  { timestamps: true, versionKey: false }
);
export const User = model<IUser>("User", userSchema);
