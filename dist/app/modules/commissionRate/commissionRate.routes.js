"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRateRoutes = void 0;
const express_1 = __importDefault(require("express"));
const commissionRate_controller_1 = require("./commissionRate.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), commissionRate_controller_1.CommissionRateController.getCommissionRate);
router.patch("/update", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), commissionRate_controller_1.CommissionRateController.updateCommissionRate);
exports.CommissionRateRoutes = router;
