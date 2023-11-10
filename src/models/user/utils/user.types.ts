import User, { userSchema } from "../user.model";
import mongoose from "mongoose";

export type UserType = mongoose.Document & {
  userId: string;
  email: string;
  token: string;
  permissions: any[];
  companyIds: string[];
  // hasPermission: (namespace: string, action: string, resource: string) => boolean;
};
// export type UserInstance= InstanceType<typeof User>;
// export type UserInstance = mongoose.Document & UserType;
// export type UserPromise = Promise<typeof User>;
export type UserPromise = Promise<UserType>;
export type UsersPromise = Promise<UserType[]>;
export type UserOrNull = UserType | null;
export type UserPromiseOrNull = Promise<UserOrNull>;
