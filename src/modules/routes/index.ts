import { Router } from "express";
import { userRoutes } from "../user/user.routes";
import { AuthRoutes } from "../auth/auth.routes";
import { WalletRoutes } from "../wallet/wallet.routes";
import { TransactionRoutes } from "../transaction/transaction.routes";

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
  {
    path: "/transaction",
    route: TransactionRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
