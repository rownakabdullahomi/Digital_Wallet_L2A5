import AppError from "../../error/AppError";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

const updateWallet = async (walletId: string, payload: Partial<IWallet>) => {
  if (!payload)
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet status not provided.");

  const isWalletExist = await Wallet.findById(walletId);

  if (!isWalletExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet does not exist.");

  const updatedWallet = await Wallet.findByIdAndUpdate(walletId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedWallet;
};

export const WallerService = {
  updateWallet,
};
