import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload: Partial<ITransaction>) => {
    const transaction = await Transaction.create(payload);
    return transaction;
}

export const TransactionService = {
    createTransaction
}