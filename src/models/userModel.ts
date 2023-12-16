/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
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

export const User = mongoose.model("User", userSchema);
export type User = InstanceType<typeof User>;

