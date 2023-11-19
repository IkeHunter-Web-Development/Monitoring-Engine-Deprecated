import { AgencySchema } from "./../../agency/agency.model";
import mongoose from "mongoose";
import Monitor from "../monitor.model";
import { AgencyType } from "src/models/agency/agency.types";
import { ProjectType } from "src/models/project/project.types";

export type MonitorType = mongoose.Document & {
  project: ProjectType;
  // agency: AgencyType;
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
