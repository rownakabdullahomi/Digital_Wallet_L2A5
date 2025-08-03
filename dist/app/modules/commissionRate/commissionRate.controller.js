"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRateController = void 0;
const commissionRate_model_1 = require("./commissionRate.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const updateCommissionRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rate } = req.body;
    const admin = req.user; // admin info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminEmail = admin === null || admin === void 0 ? void 0 : admin.email;
    if (!rate || isNaN(rate)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please provide a valid rate!!");
    }
    const updatedCommissionRate = yield commissionRate_model_1.CommissionRate.findOneAndUpdate({}, { rate, updatedBy: adminEmail || "unknown" }, { upsert: true, new: true, runValidators: true });
    // Update all AGENT users' commissionRate fields to reflect the new rate
    yield user_model_1.User.updateMany({ role: user_interface_1.Role.AGENT }, { $set: { commissionRate: rate } });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ Commission rate updated successfully",
        data: updatedCommissionRate,
    });
});
const getCommissionRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commissionRate = yield commissionRate_model_1.CommissionRate.findOne();
    if (!commissionRate)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No commission rate found!!");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "✅ Get current commission rate successfully.",
        data: commissionRate,
    });
});
exports.CommissionRateController = {
    updateCommissionRate,
    getCommissionRate,
};
