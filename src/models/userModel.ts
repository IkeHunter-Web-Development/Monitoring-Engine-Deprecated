/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
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

