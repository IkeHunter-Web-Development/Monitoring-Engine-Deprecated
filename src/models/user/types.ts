import User, { userSchema } from "./model";
import mongoose from "mongoose";

export type UserType = mongoose.Document & {
  userId: String;
  email: String;
  token?: String;
  projectIds?: any[];
};

export type UserPromise = Promise<UserType>;
export type UsersPromise = Promise<UserType[]>;
export type UserOrNull = UserType | null;
export type UserPromiseOrNull = Promise<UserOrNull>;
