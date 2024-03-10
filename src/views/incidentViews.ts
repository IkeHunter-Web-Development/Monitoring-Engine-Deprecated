import type { NextFunction, Request, Response } from 'express'
import { NotImplementedError } from 'src/utils'

export const createIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Create Incident
    #swagger.summary = 'Create Incident'
    #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Incident object",
      required: true,
      schema: { $ref: "#/definitions/IncidentDoc" }
    }
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[201] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('createIncidentView')
  } catch (error) {
    next(error)
  }
}
export const getIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Get Incident
    #swagger.summary = 'Get Incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('getIncidentView')
  } catch (error) {
    next(error)
  }
}
export const getIncidentsView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Get Multiple Incidents
    #swagger.summary = 'Get Multiple Incidents'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('getIncidentsView')
  } catch (error) {
    next(error)
  }
}
export const updateIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Update Incident
    #swagger.summary = 'Update Incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('updateIncidentView')
  } catch (error) {
    next(error)
  }
}
export const deleteIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Delete Incident
    #swagger.summary = 'Delete Incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('deleteIncidentView')
  } catch (error) {
    next(error)
  }
}

export const startActiveIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Start an active incident
    #swagger.summary = 'Start an active incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('startActiveIncidentView')
  } catch (error) {
    next(error)
  }
}
export const getActiveIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Get an active incident
    #swagger.summary = 'Get an active incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('getActiveIncidentView')
  } catch (error) {
    next(error)
  }
}
export const getActiveIncidentsView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Get all active incidents
    #swagger.summary = 'Get all active incidents'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('getActiveIncidentsView')
  } catch (error) {
    next(error)
  }
}
export const updateActiveIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Update an active incident
    #swagger.summary = 'Update an active incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('updateActiveIncidentView')
  } catch (error) {
    next(error)
  }
}
export const endActiveIncidentView = (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger End an active incident
    #swagger.summary = 'End an active incident'
    #swagger.tags = ['Incidents']
    #swagger.description = ''
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/IncidentMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    throw new NotImplementedError('endActiveIncidentView')
  } catch (error) {
    next(error)
  }
}
