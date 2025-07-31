import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

// router.post("/create", TransactionController.createTransaction);
router.post("/agent-add-money/:walletId", checkAuth(Role.AGENT), TransactionController.addMoneyForAgent);

export const TransactionRoutes = router;