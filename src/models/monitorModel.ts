import mongoose from "mongoose";
import { UserInlineSchema, UserSchema } from "./userModel";



export const MonitorSchema = new mongoose.Schema(
  {
    // TODO: targetStatusCode, currentStatusCode, status
    // TODO: Recovery mode? send request every x seconds
    projectId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    recipients: [UserInlineSchema],
    statusCode: {
      type: Number,
      default: 200,
    },
    targetStatusCode: {
      type: Number,
      default: 200,
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["online", "alert", "offline", "pending"],
      // enum: ["stable", "alert", "warning", "pending"],
      defualt: "pending",
      // required: true
    },

    online: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ["http"],
      default: "http",
    },
    endpoints: {
      type: Array,
      default: ["/"],
    },
    interval: {
      type: Number,
      default: 60,
    },
    timeout: {
      type: Number,
      default: 30,
    },
    retries: {
      type: Number,
      default: 3,
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Monitor = mongoose.model("Monitor", MonitorSchema);
export type Monitor = InstanceType<typeof Monitor>;
