import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

   //> Step 1: Create the user
  const user = await User.create({
    name,
    email,
  });

  //> Step 2: Create wallet with initial balance (e.g., ৳50)
  const wallet = await Wallet.create({
    userId: user._id,
    balance: 50,
  });


  //> Step 3: Update user's walletId
  user.walletId = wallet._id;
  await user.save();

  return user;
};

export const UserService = {
  createUser,
};
