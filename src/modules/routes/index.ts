import { Router } from "express";
import { userRoutes } from "../user/user.routes";
import { AuthRoutes } from "../auth/auth.routes";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
