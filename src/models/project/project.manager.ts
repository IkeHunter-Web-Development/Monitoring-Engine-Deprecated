import { getProject } from './../../controllers/project.controller';
import Agency from "../agency/agency.model";
import Project from "./project.model";
import { ProjectPromise } from "./project.types";

export default class ProjectManager {
  
  private static instance: ProjectManager = new ProjectManager();
  
  private async parseData(data: any) {
    let payload = {
      agency: null as any,
      // agencyId: data.agencyId || "",
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
    
    // if (!payload.agency) throw new Error("No agency provided");
    
    let project = Project.create(payload)
      .then((project: any) => {
        return project;
      })
      .catch((err: any) => {
        throw err;
      });
    
    return project;
  }
  
  static async getProject(projectId: string) {
    let project = Project.findOne({ projectId: projectId })
      .then((project: any) => {
        return project;
      })
      .catch((err: any) => {
        throw err;
      });
    
    return project;
  }
  
  static async getProjects() {
    let projects = Project.find()
      .then((projects: any) => {
        return projects;
      })
      .catch((err: any) => {
        throw err;
      });
    
    return projects;
  }
  
  static async updateProject(id: string, payload: any) {
    let project = await Project.findById(id);
    payload = await this.instance.parseData(payload);
    
    if (!project) throw new Error("Project not found");
    
    project = await project.updateOne(payload, { new: true });
    
    return project;
  }
  
  static async deleteProject(id: string) {
    let project = await Project.findById(id);
    
    if (!project) throw new Error("Project not found");
    
    project = await project.deleteOne();
    
    return project;
  }
}