import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.patch(
  "/update-status/:walletId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WalletController.updateWallet
);

export const WalletRoutes = router;
