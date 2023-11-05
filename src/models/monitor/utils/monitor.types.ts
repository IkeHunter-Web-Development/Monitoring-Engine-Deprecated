import mongoose from "mongoose";
import Monitor from "../monitor.model";

export type MonitorType = mongoose.Document & {
  projectId: string;
  companyId: string;
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
};

export type MonitorPromise = Promise<MonitorType>;
export type MonitorPromiseOrNull = Promise<MonitorType | null>;
export type MonitorOrNull = MonitorType | null;
