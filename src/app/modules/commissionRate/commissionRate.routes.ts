
import express from "express";
import { CommissionRateController } from "./commissionRate.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = express.Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CommissionRateController.getCommissionRate);
router.patch("/update", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CommissionRateController.updateCommissionRate);

export const CommissionRateRoutes = router;
