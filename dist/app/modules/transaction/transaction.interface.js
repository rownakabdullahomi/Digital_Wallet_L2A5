"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ADD_MONEY"] = "ADD_MONEY";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["SEND_MONEY"] = "SEND_MONEY";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["APPROVED"] = "APPROVED";
    TransactionStatus["DECLINED"] = "DECLINED";
    TransactionStatus["REVERSED"] = "REVERSED";
    TransactionStatus["DONE"] = "DONE";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
