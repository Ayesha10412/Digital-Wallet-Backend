import z from "zod";

export const createWalletZodSchema = z.object({
  balance: z
    .number()
    .min(0, { message: "balance cannot be negative!" })
    .optional(),
  owner: z.string({ message: "Owner ID is required!" }),
  currency: z.number().optional(),
});
export const updateWalletZodSchema = z.object({
  amount: z.number().min(1, { message: "Amount must be at least 1" }),
});
