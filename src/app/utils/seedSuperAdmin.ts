/* eslint-disable no-console */
import envVars from "../config/env";
import { IAuthProvider, IsActive, IsAgentApproved, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from 'bcryptjs';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log(`✨ SUPER ADMIN already exists!!`);
      return;
    }

    console.log(`🍀 Trying to create Super Admin..`);

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "Credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      isActive: IsActive.ACTIVE,
      isDeleted: false,
      auths: [authProvider],
      isAgentApproved: IsAgentApproved.APPROVED,
    };

    const superAdmin = await User.create(payload);

    console.log(`🎗️  Super Admin created successfully..\n`);
    console.log(superAdmin);

  } catch (error) {
    console.log(error);
  }
};
