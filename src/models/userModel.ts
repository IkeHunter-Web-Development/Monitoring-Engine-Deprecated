/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
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
  projectIds: {
    type: Array,
    required: false,
  },
});

export const User = mongoose.model("User", UserSchema);
export type User = InstanceType<typeof User>;
