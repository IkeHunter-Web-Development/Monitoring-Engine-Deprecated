import mongoose, { Schema } from "mongoose";

const EventSchema = new mongoose.Schema({
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
    // required: false,
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
    // enum: ["online", "alert", "warning", "offline"],
    // enum: ["stable", "alert", "warning", "pending"],
    enum: ["online", "alert", "offline", "pending"]
  }
}, {
  timestamps: true
});


export const Event = mongoose.model("Event", EventSchema);
export type Event = InstanceType<typeof Event> & {
  timestamp: Date
};
// export interface Event extends InstanceType<typeof Event> {
//   timestamp: Date;
// }


