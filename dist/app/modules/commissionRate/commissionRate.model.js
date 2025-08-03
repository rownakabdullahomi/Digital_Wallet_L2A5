"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRate = void 0;
const mongoose_1 = require("mongoose");
const commissionRateSchema = new mongoose_1.Schema({
    rate: {
        type: Number,
        required: true,
        default: 0.1,
    },
    updatedBy: {
        type: String,
        required: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.CommissionRate = (0, mongoose_1.model)("CommissionRate", commissionRateSchema);
