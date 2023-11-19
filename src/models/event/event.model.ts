import mongoose from "mongoose";
import Monitor, { monitorSchema } from "../monitor/monitor.model";

const eventSchema = new mongoose.Schema({
  monitorId: {
    type: String,
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

const Event = mongoose.model("Event", eventSchema);

export default Event;
export type EventType = InstanceType<typeof Event>;
