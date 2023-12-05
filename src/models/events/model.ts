import mongoose, { Schema } from "mongoose";

const eventSchema = new mongoose.Schema({
  monitorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  online: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  responseTime: {
    type: Number,
    required: false,
  },
});

export const Event = mongoose.model("Event", eventSchema);
export type Event = InstanceType<typeof Event>;


