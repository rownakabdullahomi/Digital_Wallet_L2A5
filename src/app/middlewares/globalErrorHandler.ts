/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import envVars from "../config/env";
import AppError from "../error/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { TErrorSources } from "../interfaces/error.types";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(error);
  }

 let statusCode = 500;
  let message = `Something went wrong!!`;
  let errorSources: TErrorSources[] = [];

  /// Duplicate Error
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  /// Cast Error
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  /// Zod Validation Error
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  /// Mongoose Validation Error
  else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
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
