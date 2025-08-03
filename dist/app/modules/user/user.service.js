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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("../../config/env"));
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("../wallet/wallet.interface");
const commissionRate_model_1 = require("../commissionRate/commissionRate.model");
const wallet_validation_1 = require("../wallet/wallet.validation");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists.");
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.default.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "Credentials",
        providerId: email,
    };
    //> Step 1: Create the user
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    //> Step 2: Create wallet with initial balance (৳50)
    // Validate input manually
    const walletInput = wallet_validation_1.createWalletZodSchema.parse({
        userId: user._id.toString(),
        balance: 50,
        walletStatus: wallet_interface_1.WalletStatus.ACTIVE,
    });
    // Then create wallet
    const wallet = yield wallet_model_1.Wallet.create(walletInput);
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    //> Step 3: Create initial transaction for opening balance
    yield transaction_model_1.Transaction.create({
        userId: user._id,
        walletId: wallet._id,
        transactionType: transaction_interface_1.TransactionType.ADD_MONEY,
        transactionStatus: transaction_interface_1.TransactionStatus.APPROVED,
        transactionAmount: 50,
        walletStatus: wallet_interface_1.WalletStatus.ACTIVE,
        description: "Initial wallet creation balance",
    });
    //> Step 4: Update user's walletId
    user.walletId = wallet._id;
    yield user.save();
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
// const updateUserToAgent = async (userId: string) => {
//   if (!isValidObjectId(userId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
//   }
//   const isUserExist = await User.findById(userId);
//   if (!isUserExist)
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     {
//       role: "AGENT",
//       isAgentApproved: "APPROVED",
//     },
//     { new: true }
//   );
//   return {
//     data: updatedUser,
//   };
// };
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, mongoose_1.isValidObjectId)(userId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please provide a valid user ID");
    }
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!!");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!!");
        }
        if (payload.role === user_interface_1.Role.AGENT &&
            isUserExist.role === user_interface_1.Role.USER &&
            payload.isAgentApproved === user_interface_1.IsAgentApproved.APPROVED) {
            payload.isAgentApproved = user_interface_1.IsAgentApproved.APPROVED;
            // Fetch the commission rate from the DB
            const commission = yield commissionRate_model_1.CommissionRate.findOne();
            if (!commission)
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Commission rate not found!!");
            payload.commissionRate = commission.rate;
            // Remove walletStatus from wallet when user becomes an approved agent
            yield wallet_model_1.Wallet.updateOne({ userId: isUserExist._id }, { $unset: { walletStatus: "" } });
        }
        if (payload.role === user_interface_1.Role.AGENT &&
            isUserExist.role === user_interface_1.Role.AGENT &&
            payload.isAgentApproved === user_interface_1.IsAgentApproved.SUSPENDED) {
            payload.isAgentApproved = user_interface_1.IsAgentApproved.SUSPENDED;
        }
        if (payload.role === user_interface_1.Role.AGENT &&
            isUserExist.role === user_interface_1.Role.AGENT &&
            payload.isAgentApproved === user_interface_1.IsAgentApproved.APPROVED) {
            payload.isAgentApproved = user_interface_1.IsAgentApproved.APPROVED;
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized!!");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.default.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
exports.UserService = {
    createUser,
    getAllUsers,
    updateUser,
};
