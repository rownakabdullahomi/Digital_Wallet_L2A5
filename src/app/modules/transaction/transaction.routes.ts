import { Router } from "express";
import { TransactionController } from "./transaction.controller";


const router = Router();

router.post("/create", TransactionController.createTransaction);

export const TransactionRoutes = router;