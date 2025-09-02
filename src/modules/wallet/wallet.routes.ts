import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";

const router = Router();
router.post("/deposit", checkAuth("USER", "AGENT"), WalletControllers.addMoney);
export const WalletRoutes = router;
