import { Request, Response } from "express";
import ProjectManager from "../models/project/project.manager";
import { ProjectType } from "src/models/project/project.types";

export const createProject = async (req: Request, res: Response) => {
  /**
   * @swagger Create project
   * #swagger.tags = ['Project']
   * #swagger.description = 'Endpoint for creating a project.'
   * #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Monitor object",
      required: true,
      schema: {
        "agencyId": "string" ,
        "projectId": "string" ,
        "name": "string" 
      }
    }
   * #swagger.responses[200] = {
   *   schema: { $ref: "#/definitions/ProjectResponse" },
   *   description: "Project created"
   * }
   * #swagger.responses[500] = {
   *   schema: {$ref: "#/definitions/Error500"},
   * }
   */
  const body = req.body;

  await ProjectManager.createProject(body)
    .then((project) => {
      return res.status(201).json(project);
    })
    .catch((err: any) => {
      return res.status(500).json(err);
    });
};
export const getProjects = (req: Request, res: Response) => {
  /**
   * @swagger Get projects
   * #swagger.tags = ['Project']
   * #swagger.description = 'Endpoint for getting all projects.'
   * #swagger.responses[200] = {
   *   schema: { $ref: "#/definitions/ProjectsResponse" },
   *   description: "Projects retrieved"
   * }
   * #swagger.responses[500] = {
   *   schema: {$ref: "#/definitions/Error500"},
   * }
   */
  const projects = ProjectManager.getProjects().catch((err: any) => {
    return res.status(500).json(err);
  });

  return res.status(200).json(projects);
};
export const getProject = (req: Request, res: Response) => {
  /**
   * @swagger Get project
   * #swagger.tags = ['Project']
   * #swagger.description = 'Endpoint for getting a project.'
   * #swagger.parameters['id'] = { description: 'Project ID' }
   * #swagger.responses[200] = {
   *   schema: { $ref: "#/definitions/ProjectResponse" },
   *   description: "Project retrieved"
   * }
   * #swagger.responses[500] = {
   *   schema: {$ref: "#/definitions/Error500"},
   * }
   */
  const projectId = req.params.id;

  const project = ProjectManager.getProject(projectId).catch((err: any) => {
    return res.status(500).json(err);
  });

  return res.status(200).json(project);
};
export const updateProject = (req: Request, res: Response) => {
  /**
   * @swagger Update project
   * #swagger.tags = ['Project']
   * #swagger.description = 'Endpoint for updating a project.'
   * #swagger.parameters['id'] = { description: 'Project ID' }
   * #swagger.parameters['project'] = { description: 'Project object' }
   * #swagger.responses[200] = {
   *   schema: { $ref: "#/definitions/ProjectResponse" },
   *   description: "Project updated"
   * }
   * #swagger.responses[500] = {
   *   schema: {$ref: "#/definitions/Error500"},
   * }
   * #swagger.responses[404] = {
   *   schema: {$ref: "#/definitions/Error404"},
   * }
   */
  const projectId = req.params.id;
  const project = req.body;

  ProjectManager.updateProject(projectId, project).catch((err: any) => {
    return res.status(500).json(err);
  });

  return res.status(200).json(project);
};
export const deleteProject = (req: Request, res: Response) => {
  /**
   * @swagger Delete project
   * #swagger.tags = ['Project']
   * #swagger.description = 'Endpoint for deleting a project.'
   * #swagger.parameters['id'] = { description: 'Project ID' }
   * #swagger.responses[200] = {
   *   schema: { $ref: "#/definitions/ProjectResponse" },
   *   description: "Project deleted"
   * }
   * #swagger.responses[500] = {
   *   schema: {$ref: "#/definitions/Error500"},
   * }
   * #swagger.responses[404] = {
   *   schema: {$ref: "#/definitions/Error404"},
   * }
   */
  const projectId = req.params.id;

  ProjectManager.deleteProject(projectId).catch((err: any) => {
    return res.status(500).json(err);
  });

  return res.status(200).json(projectId);
};
