import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";

const router = Router();
router.post("/deposit", checkAuth("USER", "AGENT"), WalletControllers.addMoney);
router.post(
  "/withdraw",
  checkAuth("USER", "AGENT"),
  WalletControllers.withdrawMoney
);
router.post("/send", checkAuth("USER", "AGENT"), WalletControllers.sendMoney);
router.post("/cash-in", checkAuth("USER", "AGENT"), WalletControllers.cashIn);
router.post(
  "/cash-out",
  checkAuth("USER", "AGENT"),
  WalletControllers.cashOutMoney
);
router.get(
  "/:id",
  checkAuth("USER", "AGENT"),
  WalletControllers.getWalletBalance
);
router.get(
  "/history/:userId",
  checkAuth("USER", "AGENT"),
  WalletControllers.getTransactionHistory
);

export const WalletRoutes = router;
