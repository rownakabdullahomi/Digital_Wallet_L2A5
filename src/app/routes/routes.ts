import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { TransactionRoutes } from "../modules/transaction/transaction.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { WalletRoutes } from "../modules/wallet/wallet.routes";
import { CommissionRateRoutes } from "../modules/commissionRate/commissionRate.routes";

export const router = Router();


router.use("/user", UserRoutes);
router.use("/transaction", TransactionRoutes);
router.use("/auth", AuthRoutes);
router.use("/wallet", WalletRoutes);
router.use("/commission", CommissionRateRoutes);




// const moduleRoutes = [
//   {
//     path: "/user",
//     route: UserRoutes,
//   },
// ];

// moduleRoutes.forEach((moduleRoute) => {
//   router.use(moduleRoute.path, moduleRoute.route);
// });


