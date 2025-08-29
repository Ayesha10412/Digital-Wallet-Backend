import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const createWallet = async (payload: Partial<IWallet>) => {
  const wallet = await Wallet.create(payload);
  return wallet;
};
export const WalletServices = { createWallet };
