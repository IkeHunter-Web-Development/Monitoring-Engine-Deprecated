import mongoose from "mongoose";

interface MonitorObject {
  projectId: string;
  url: string;
  users: any[];
  statusCode: number;
  active: boolean;
  title: string;
  online: boolean;
  type: string;
  endpoints: Array<string>;
  interval: number;
  timeout: number;
  retries: number;
}

export type MonitorType = mongoose.Document & MonitorObject;

export type MonitorPromise = Promise<MonitorType>;
export type MonitorPromiseOrNull = Promise<MonitorType | null>;
export type MonitorOrNull = MonitorType | null;

export interface MonitorDetails extends MonitorObject {
  totalDowntimeMinutes: number;
  totalUptimeMinutes: number;
  totalEvents: number;
  totalDowntimeEvents: number;
  averageResponseTime: number;
}

export type MonitorDetailsPromise = Promise<MonitorDetails>;

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
