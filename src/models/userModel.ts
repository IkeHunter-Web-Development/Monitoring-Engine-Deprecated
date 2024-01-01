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

export const UserInlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true
  },
  phone: {
    type: String,
  },
  preferredMethod: {
    type: String,
    enum: ["email", "phone"],
    default: "email",
  },
  enabled: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// export const User = mongoose.model("User", UserSchema);
// export type User = InstanceType<typeof User>;
