import mongoose from "mongoose";

interface ReportObject {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalDowntimeMinutes: number;
  totalUptimeMinutes: number;
  daysWithDowntime: Array<Date>;
  totalEvents: number;
  totalDowntimeEvents: number;
  totalUptimeEvents: number;
  averageResponseTime: number;
}

export type ReportType = mongoose.Document & ReportObject;
export type ReportPromise = Promise<ReportType>;