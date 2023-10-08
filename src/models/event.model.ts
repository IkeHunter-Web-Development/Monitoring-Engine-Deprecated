import mongoose from "mongoose";
import Monitor, { monitorSchema } from "./monitor.model";

const eventSchema = new mongoose.Schema({
  monitor: monitorSchema,
  statusCode: {
    type: Number,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Event", eventSchema);
