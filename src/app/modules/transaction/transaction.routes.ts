import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTransactionZodSchema, updateTransactionZodSchema } from "./transaction.validation";

const router = Router();

// router.post("/create", TransactionController.createTransaction);
router.post(
  "/agent-add-money/:userId",
  checkAuth(Role.AGENT),
  TransactionController.addMoneyForAgent
);
router.post(
  "/user-cash-in-out",
  checkAuth(Role.USER),
  validateRequest(createTransactionZodSchema),
  TransactionController.cashInOutRequestFromUser
);
router.post(
  "/cash-in-out-approval-from-agent",
  checkAuth(Role.AGENT),
  validateRequest(updateTransactionZodSchema),
  TransactionController.cashInOutApprovalFromAgent
);
router.post(
  "/send-money",
  checkAuth(Role.USER),
  TransactionController.sendMoney
);
router.get(
  "/history/:walletId",
  checkAuth(Role.USER, Role.AGENT),
  TransactionController.transactionsByWalletId
);
router.get(
  "/all-history",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.allTransactions
);

export const TransactionRoutes = router;
