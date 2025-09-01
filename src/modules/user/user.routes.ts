import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users", checkAuth(ROLE.ADMIN), UserControllers.getAllUsers);
router.get(
  "/me",
  checkAuth("USER", "ADMIN", "AGENT"),
  UserControllers.getOwnProfile
);
router.patch(
  "/me",
  checkAuth("USER", "AGENT", "ADMIN"),
  UserControllers.updateOwnProfile
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(ROLE)),
  UserControllers.updateUser
);
export const userRoutes = router;
