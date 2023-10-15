/**
 * @fileoverview API controller for the monitor objects.
 */
import Monitor, { MonitorType } from "../models/monitor.model";
import MonitorManager from "../models/monitor.manager";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export const createMonitor = async (req: Request, res: Response) => {
  /**======================*
    @swagger Create Monitor
    swagger.requestBody = {
      description: "Monitor object",  
      required: true,
      content: {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "title": {
                "example": "Example Monitor" 
              },
              "projectId": {
                "example": "1234567" 
              },
              "url": {
                "example": "https://ikehunter.com"
              },
              "statusCode": {
                "example": "200"
              },
              "users": {
                "example": [
                  {
                    "userId": "123456",
                    "email": "user@example.com"
                  }
                ]
              }
            }
          }
        }
      }
    }
    #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Monitor object",
      required: true,
      schema: {
        projectId: "123456",
        url: "https://ikehunter.com",
        statusCode: 200,
        title: "Example Monitor",
        users: [
          {
            userId: "123456",
            email: "user@example.com"
          }
        ]
        
      }
    }
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for creating a monitor.'
    #swagger.responses[201] = {
      schema: { $ref: "#/definitions/Monitor" },
      description: "Monitor created"
    }
    #swagger.responses[500] = {
      schema: {
        message: "Error message..."
      }
    }
   *========================*/
  
  // let payload = {
  //   title: req.body.title,
  //   projectId: req.body.projectId,
  //   url: req.body.url,
  //   statusCode: req.body.statusCode,
  //   users: req.body.users,
  
  // }

  MonitorManager.createMonitor(req.body)
    .then((monitor: any) => {
      return res.status(201).json(monitor);
    })
    .catch((err: any) => {
      console.log(err);
      let payload = {
        message: err.message,
      };
      return res.status(500).json(payload);
    });
};

export const updateMonitor = async (req: Request, res: Response) => {
  /**======================*
    @swagger Update Monitor
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for updating a monitor.'
    #swagger.parameters['id'] = { description: 'Monitor ID' }
    #swagger.requestBody = {
      description: "Monitor object",
      required: true,
      content: {
        "application/json": {
          schema: {
            "type": "object",
            "properties": {
              "title": {
                "example": "Example Monitor"
              },
              "projectId": {
                "example": "1234567"
              },
              "url": {
                "example": "https://ikehunter.com"
              },
              "statusCode": {
                "example": 200
              },
              "users": {
                "example": [
                  {
                    "userId": "123456",
                    "email": "user@example.com"
                  }
                ]
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Monitor" },
        description: "Monitor updated"
    }

    #swagger.responses[500] = {
      schema: {
        message: "Error message..."
      }
    }
   *=======================*/
  const id = req.params.id || "";

  MonitorManager.updateMonitor(id, req.body)
    .then((monitor: any) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
      return res.status(200).json(monitor);
    })
    .catch((err: any) => {
      console.log(err);
      let payload = {
        message: err.message,
      };
      return res.status(500).json(payload);
    });
};

export const getMonitor = async (req: Request, res: Response) => {
  /**==========================*
    @swagger Get Single Monitor
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for getting a single monitor.'
    #swagger.parameters['id'] = { description: 'Monitor ID' }
    #swagger.responses[200] = {
          schema: { $ref: "#/definitions/Monitor" },
          description: "Monitor updated"
      }
    #swagger.responses[500] = {
      schema: {
        message: "Error message..."
      }
    }
   *===========================*/
  const id = req.params.id || "";

  MonitorManager.getMonitor(id)
    .then((monitor: any) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
      return res.status(200).json(monitor);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const deleteMonitor = async (req: Request, res: Response) => {
  const id = req.params.id || "";

  MonitorManager.deleteMonitor(id)
    .then(() => {
      return res.status(200).json({ message: "Monitor deleted" });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const getMonitors = async (req: Request, res: Response) => {
  MonitorManager.getMonitors()
    .then((monitors: any) => {
      return res.status(200).json(monitors);
    })
    .catch((err: any) => {
      return res.status(500).json(err);
    });
};

export const searchMonitors = async (req: Request, res: Response) => {
  const params = req.query || {};

  MonitorManager.searchMonitors(params)
    .then((events: any) => {
      return res.status(200).json(events);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const getMonitorOnlineStatus = async (req: Request, res: Response) => {
  const id = req.params.id || "";

  let monitor = await MonitorManager.getMonitor(id);

  if (!monitor) {
    return res.status(404).json({ message: "Monitor not found" });
  }

  if (!monitor.online) {
    return res.status(200).json({ online: false });
  } else {
    return res.status(200).json({ online: true });
  }
};
