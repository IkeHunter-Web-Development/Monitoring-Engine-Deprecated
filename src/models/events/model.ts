import mongoose, { Schema, Types } from "mongoose";
import Monitor, { monitorSchema } from "../monitor/model";
import { ObjectId } from "mongodb";

const eventSchema = new mongoose.Schema({
  // monitorId: {
  //   type: String,
  //   required: true,
  // },
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

const Event = mongoose.model("Event", eventSchema);

export default Event;
