/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";
import { PolicySchema } from "../policy/policy.model";
import { UserType } from "./utils/user.types";

// TODO: users will have policies that define what they can do
// TODO: users will have permissions that are queried before actions
// TODO: permissions are grouped by company, re-written everytime someone updates
//       a policy within a company

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  permissions: [PolicySchema],
});

userSchema.methods.hasPermission = (namespace: string, action: string, resource: string) => {
  return true;
};

const User = mongoose.model("User", userSchema);
export default User;
