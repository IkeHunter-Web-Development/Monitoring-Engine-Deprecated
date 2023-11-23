import { AgencyType } from "../agency/agency.types";

export interface ProjectType {
  agencyId: AgencyType;
  projectId: string;
  name: string;
}

export type ProjectPromise = Promise<ProjectType>;
