import { AgencySchema } from "./../../agency/agency.model";
import mongoose from "mongoose";
// import Monitor from "../monitor.model";
import { AgencyType } from "src/models/agency/agency.types";
import { ProjectType } from "src/models/project/project.types";

interface MonitorObject {
  project: ProjectType;
  url: string;
  users: any[];
  statusCode: number;
  active: {
    type: Boolean;
    default: true;
  };
  title: string;
  online: {
    type: Boolean;
    default: true;
  };
  type: {
    type: String;
    enum: ["http"];
    default: "http";
  };
  endpoints: {
    type: Array<string>;
    default: ["/"];
  };
  interval: {
    type: Number;
    default: 60;
  };
  timeout: {
    type: Number;
    default: 30;
  };
  retries: {
    type: Number;
    default: 3;
  };
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