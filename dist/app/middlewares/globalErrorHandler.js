"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = __importDefault(require("../config/env"));
const AppError_1 = __importDefault(require("../error/AppError"));
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const globalErrorHandler = (error, req, res, next) => {
    if (env_1.default.NODE_ENV === "development") {
        console.log(error);
    }
    let statusCode = 500;
    let message = `Something went wrong!!`;
    let errorSources = [];
    /// Duplicate Error
    if (error.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    /// Cast Error
    else if (error.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    /// Zod Validation Error
    else if (error.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    /// Mongoose Validation Error
    else if (error.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(error);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env_1.default.NODE_ENV === "development" ? error : null,
        stack: env_1.default.NODE_ENV === "development" ? error.stack : null,
    });
    // if(error instanceof AppError){
    //   statusCode = error.statusCode;
    //   message = error.message
    // }
    // if(error instanceof Error){
    //   statusCode = 500;
    //   message = error.message;
    // }
    // res.status(statusCode).json({
    //   success: false,
    //   message ,
    //   error,
    //   stack: envVars.NODE_ENV === "development" ? error.stack : null,
    // });
};
exports.globalErrorHandler = globalErrorHandler;
