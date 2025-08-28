import { Router } from "express";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
export const userRoutes = router;
