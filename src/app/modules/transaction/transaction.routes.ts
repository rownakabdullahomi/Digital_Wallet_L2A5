import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

// router.post("/create", TransactionController.createTransaction);
router.post("/agent-add-money/:userId", checkAuth(Role.AGENT), TransactionController.addMoneyForAgent);
router.post("/user-cash-in-out/:userId", checkAuth(Role.USER), TransactionController.cashInOutRequestFromUser);
router.post("/cash-in-out-approval-from-agent/:agentId", checkAuth(Role.AGENT), TransactionController.cashInOutApprovalFromAgent);

export const TransactionRoutes = router;