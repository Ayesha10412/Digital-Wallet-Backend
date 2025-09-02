export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  SEND = "send",
  CASH_IN = "cash-in",
  CASH_OUT = "cash-out",
}
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}
export interface ITransaction {
  fromUser?: string;
  toUser?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}
