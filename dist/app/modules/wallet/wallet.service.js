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
exports.WallerService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const updateWallet = (walletId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet status not provided.");
    const isWalletExist = yield wallet_model_1.Wallet.findById(walletId);
    if (!isWalletExist)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet does not exist.");
    const updatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(walletId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedWallet;
});
exports.WallerService = {
    updateWallet,
};
