import { envVars } from "../config/env";
import { IAuthProviders, IUser, ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });
    if (isAdminExist) {
      console.log(" Admin already exist");
      return;
    }
    console.log("Trying to create  admin...");
    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const authProvider: IAuthProviders = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: ROLE.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const admin = await User.create(payload);
    console.log("Admin created successfully!");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
