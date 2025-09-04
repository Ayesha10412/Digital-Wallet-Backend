import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TransactionController } from "./transaction.controller";

const router = Router();
router.get(
  "/me",
  checkAuth("USER", "AGENT"),
  TransactionController.getOwnTransaction
);
router.get("/all", checkAuth("ADMIN"), TransactionController.getAllTransaction);
router.get(
  "/:id",
  checkAuth("USER", "ADMIN"),
  TransactionController.getTransactionById
);
export const TransactionRoutes = router;
