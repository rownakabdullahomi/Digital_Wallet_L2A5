"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const wallet_routes_1 = require("../modules/wallet/wallet.routes");
const commissionRate_routes_1 = require("../modules/commissionRate/commissionRate.routes");
exports.router = (0, express_1.Router)();
exports.router.use("/user", user_routes_1.UserRoutes);
exports.router.use("/transaction", transaction_routes_1.TransactionRoutes);
exports.router.use("/auth", auth_routes_1.AuthRoutes);
exports.router.use("/wallet", wallet_routes_1.WalletRoutes);
exports.router.use("/commission", commissionRate_routes_1.CommissionRateRoutes);
// const moduleRoutes = [
//   {
//     path: "/user",
//     route: UserRoutes,
//   },
// ];
// moduleRoutes.forEach((moduleRoute) => {
//   router.use(moduleRoute.path, moduleRoute.route);
// });
