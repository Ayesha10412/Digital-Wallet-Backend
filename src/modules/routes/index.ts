import { Router } from "express";
import { userRoutes } from "../user/user.routes";
import { AuthRoutes } from "../auth/auth.routes";
import { WalletRoutes } from "../wallet/wallet.routes";

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
  {
    path: "/wallet",
    route: WalletRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
