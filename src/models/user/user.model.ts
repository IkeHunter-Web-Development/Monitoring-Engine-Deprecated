/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";
import { PolicySchema } from '../policy/policy.model';

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
  permissions: [PolicySchema]
});

const User = mongoose.model("User", userSchema);
export default User;

export type UserType = InstanceType<typeof User>;


