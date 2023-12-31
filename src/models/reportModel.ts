import mongoose, { Schema } from "mongoose";

export const ReportSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// ReportSchema.index({ expireAfterSeconds: 1000 });

export const Report = mongoose.model("Report", ReportSchema);
export type Report = InstanceType<typeof Report>;
