import { UserInlineSchema, UserSchema } from "src/models";
import { ObjectId } from "mongoose";
import { Event, Report } from "src/models";
import { MonitorResponse } from "src/models/responseModel";

export interface MonitorDetail {
  id: string;
  project: string;
  company: string;
  url: string;
  recipients: (typeof UserInlineSchema)[] | { name: string; email: string }[];
  status: string;
  targetStatusCode: number;
  currentStatusCode: number;
  active: boolean;
  title: string;
  type: string;
  dateAdded: Date;
  responseTime: number;
  timeout: number;
  retries: number;
  coverImage: string;
  events:
    | Event[]
    | {
        id: ObjectId;
        statusCode: number;
        online: boolean;
        timestamp: Date;
        message: string;
      }[];
  report:
    | Report
    | {
        totalDays: number;
        totalEventCount: number;
        totalDowntimeEvents: number;
        totalUptimeEvents: number;
        averageResponseTime: number;
        totalDowntimeMinutes: number;
        totalUptimeMinutes: number;
      };
  // responses: {
  //   responseTime: number;
  //   timestamp: Date;
  // }[];
  responses: MonitorResponse[];
}
