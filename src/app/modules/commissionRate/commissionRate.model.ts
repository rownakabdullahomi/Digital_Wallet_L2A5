
import { Schema, model } from "mongoose";

export interface ICommissionRate {
  rate: number;
  updatedBy: string; 
}

const commissionRateSchema = new Schema<ICommissionRate>(
  {
    rate: {
      type: Number,
      required: true,
      default: 0.1,
    },
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const CommissionRate = model<ICommissionRate>("CommissionRate", commissionRateSchema);
