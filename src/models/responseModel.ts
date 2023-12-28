import mongoose, { Types } from "mongoose";

export const MonitorResponseSchema = new mongoose.Schema({
  monitorId: {
    type: Types.ObjectId,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true
  }
});

export const MonitorResponse = mongoose.model("MonitorResponse", MonitorResponseSchema);
export type MonitorResponse = InstanceType<typeof MonitorResponse>;
