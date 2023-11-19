import { AgencyType } from "../agency/agency.types";

export interface ProjectType {
  agency: AgencyType;
  projectId: string;
  name: string;
}

export type ProjectPromise = Promise<ProjectType>;
