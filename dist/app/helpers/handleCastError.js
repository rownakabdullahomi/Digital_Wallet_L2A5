"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    return {
        statusCode: 400,
        message: "Please provide a valid user ID."
    };
};
exports.handleCastError = handleCastError;
