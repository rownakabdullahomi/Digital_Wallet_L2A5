import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateWalletZodSchema } from "./wallet.validation";



const router = Router();

router.patch(
  "/update-status/:walletId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateWalletZodSchema),
  WalletController.updateWallet
);

export const WalletRoutes = router;
