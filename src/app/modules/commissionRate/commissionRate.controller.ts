// controllers/commissionRate.controller.ts
import { Request, Response } from "express";
import { CommissionRate } from "./commissionRate.model";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

const updateCommissionRate = async (req: Request, res: Response) => {
  const { rate } = req.body;
  const admin = req.user; // admin info
  if (!rate || isNaN(rate)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide a valid rate!!");
  }

  const updatedCommissionRate = await CommissionRate.findOneAndUpdate(
    {},
    { rate, updatedBy: admin?.email || "unknown" },
    { upsert: true, new: true, runValidators: true }
  );

  // Update all AGENT users' commissionRate fields to reflect the new rate
  await User.updateMany(
    { role: Role.AGENT },
    { $set: { commissionRate: rate } }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "✅ Commission rate updated successfully",
    data: updatedCommissionRate,
  });
};

const getCommissionRate = async (req: Request, res: Response) => {
  const commissionRate = await CommissionRate.findOne();
  if (!commissionRate)
    throw new AppError(httpStatus.NOT_FOUND, "No commission rate found!!");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "✅ Get current commission rate successfully.",
    data: commissionRate,
  });
};

export const CommissionRateController = {
  updateCommissionRate,
  getCommissionRate,
};
