import z from "zod";

export const createTransactionZodSchema = z.object({
  fromUser: z.string().optional(),
  toUser: z.string().optional(),
  amount: z.number().min(1),
  type: z.enum(["deposit", "withdraw", "send", "cash-in", "cash-out"]),
  status: z.enum(["PENDING", "COMPLETED", "REVERSED"]).optional(),
});
