import mongoose from "mongoose";
import { monitorSchema } from "../../../monitor/models/model";

export const Report = new mongoose.Schema({
  rangeType: {
    type: String,
    required: true,
    enum: ["day", "week", "month", "year"],
  },
  // dayRange: {
  //   type: Number,
  //   required: true,
  //   default: 1,
  // },
  rangeStart: {
    type: Date,
    required: true,
  },
  rangeEnd: {
    type: Date,
    required: true,
  },
  totalDowntimeMinutes: {
    type: Number,
    required: true,
  },
  totalUptimeMinutes: {
    type: Number,
    required: true,
  },
  totalEvents: {
    type: Number,
    required: true,
  },
  totalDowntimeEvents: {
    type: Number,
    required: true,
  },
  totalUptimeEvents: {
    type: Number,
    required: true,
  },
  averageResponseTime: {
    type: Number,
    required: true,
  },
  totalRequests: {
    type: Number,
    required: true,
  },
  totalSuccessfulRequests: {
    type: Number,
    required: true,
  },
  totalFailedRequests: {
    type: Number,
    required: true,
  },
});
