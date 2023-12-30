import mongoose, { Schema } from "mongoose";

export const ReportSchema = new mongoose.Schema(
  {
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
    monitorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60 * 1000,
    },
    // expireAt: {
    //   type: Date,
    //   // default: Date.now() + 24 * 60 * 60 * 1000   // expires in 24h
    //   // default: Date.now() + 1 * 60 * 1000,
    //   default: Date.now,
    //   index: { expires: "1m" },
    // },
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
  },
  {
    timestamps: true,
  }
);

// ReportSchema.index({ expireAfterSeconds: 1000 });

export const Report = mongoose.model("Report", ReportSchema);
export type Report = InstanceType<typeof Report>;
