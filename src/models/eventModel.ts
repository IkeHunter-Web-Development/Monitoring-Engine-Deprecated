import mongoose, { Schema } from "mongoose";

const EventSchema = new mongoose.Schema({
  monitorId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  projectId: {
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
    default: Date.now,
  },
  message: {
    type: String,
    required: false,
  },
  responseTime: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ["online", "alert", "offline", "pending"],
    required: true
  }
}, {
  timestamps: true
});


export const Event = mongoose.model("Event", EventSchema);
export type Event = InstanceType<typeof Event> & {
  timestamp: Date
};
