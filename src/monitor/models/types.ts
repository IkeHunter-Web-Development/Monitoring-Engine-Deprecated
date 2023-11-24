// import { AgencySchema } from "./../../agency/agency.model";
import mongoose from "mongoose";
// import Monitor from "../monitor.model";
// import { AgencyType } from "src/models/agency/agency.types";
// import { ProjectType } from "src/models/project/project.types";

interface MonitorObject {
  // project: ProjectType;
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