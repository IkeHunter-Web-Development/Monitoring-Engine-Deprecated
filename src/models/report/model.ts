import mongoose from "mongoose";

export const ReportSchema = new mongoose.Schema({
  // rangeType: {
  //   type: String,
  //   required: true,
  //   enum: ["day", "week", "month", "year"],
  // },
  // dayRange: {
  //   type: Number,
  //   required: true,
  //   default: 1,
  // },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  totalUptimeMinutes: {
    type: Number,
    required: true,
  },
  totalDowntimeMinutes: {
    type: Number,
    required: true,
  },
  daysWithDowntime: {
    type: [Date],
    required: true,
  },
  totalEvents: {
    type: Number,
    required: true,
  },
  totalUptimeEvents: {
    type: Number,
    required: true,
  },
  totalDowntimeEvents: {
    type: Number,
    required: true,
  },
  averageResponseTime: {
    type: Number,
    required: true,
  },
  // totalRequests: {
  //   type: Number,
  //   required: true,
  // },
  // totalSuccessfulRequests: {
  //   // TODO: is this needed?
  //   type: Number,
  //   required: true,
  // },
  // totalFailedRequests: {
  //   // TODO: is this needed?
  //   type: Number,
  //   required: true,
  // },
});

export const Report = mongoose.model("Report", ReportSchema);
export type Report = InstanceType<typeof Report>;


