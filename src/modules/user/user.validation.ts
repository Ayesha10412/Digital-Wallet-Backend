import z from "zod";
import { ROLE, Status } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short. Minimum 2 character long!" })
    .max(50, { message: "Name too long!" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Must include at least one uppercase letter, one number, and one special character"
    ),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(
      /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
      "Invalid Bangladeshi phone number"
    )
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "{Address cannot exceed 200 characters." })
    .optional(),
  // role:z.enum(["ADMIN","USER","AGENT"]),
  // Status:z.enum(["ACTIVE","INACTIVE"])
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short. Minimum 2 character long!" })
    .max(50, { message: "Name too long!" })
    .optional(),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Must include at least one uppercase letter, one number, and one special character"
    )
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(
      /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
      "Invalid Bangladeshi phone number"
    )
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "{Address cannot exceed 200 characters." })
    .optional(),
  role: z.enum(Object.keys(ROLE) as [string]).optional(),
  status: z.enum(Object.values(Status) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "IsDeleted must be true or false!" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "IsDeleted must be true or false!" })
    .optional(),
  isApproved: z
    .boolean({ invalid_type_error: "IsDeleted must be true or false!" })
    .optional(),
  commissionRate: z.number().min(0).optional(),
  // role:z.enum(["ADMIN","USER","AGENT"]),
  // Status:z.enum(["ACTIVE","INACTIVE"])
});
