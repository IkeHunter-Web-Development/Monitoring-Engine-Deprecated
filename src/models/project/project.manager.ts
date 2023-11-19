import Agency from "../agency/agency.model";
import Project from "./project.model";
import { ProjectPromise } from "./project.types";

export default class ProjectManager {
  
  private static instance: ProjectManager = new ProjectManager();
  
  private async parseData(data: any) {
    let payload = {
      agency: null as any,
      projectId: data.projectId || "",
      name: data.name || "",
    };
    
    if (data.agency) {
      let agency = await Agency.findOne({ agencyId: data.agency.agencyId });
      
      if (agency) payload.agency = agency;
    }
    
    return payload;
  }
  
  static async createProject(data: any): ProjectPromise {
    let payload = await this.instance.parseData(data);
    
    if (!payload.agency) throw new Error("No agency provided");
    
    let project = Project.create(payload)
      .then((project: any) => {
        return project;
      })
      .catch((err: any) => {
        throw err;
      });
    
    return project;
  }
}