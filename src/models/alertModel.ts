import mongoose from "mongoose";
import { UserSchema } from "./userModel";

export const AlertSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  recipients: [UserSchema],
});

export const Alert = mongoose.model("Alert", AlertSchema);
export type Alert = InstanceType<typeof Alert>;
