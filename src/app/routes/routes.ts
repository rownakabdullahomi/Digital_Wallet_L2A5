import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { TransactionRoutes } from "../modules/transaction/transaction.routes";

export const router = Router();


router.use("/user", UserRoutes);
router.use("/transaction", TransactionRoutes);




// const moduleRoutes = [
//   {
//     path: "/user",
//     route: UserRoutes,
//   },
// ];

// moduleRoutes.forEach((moduleRoute) => {
//   router.use(moduleRoute.path, moduleRoute.route);
// });


