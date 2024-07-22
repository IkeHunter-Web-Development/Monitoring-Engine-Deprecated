import type { NextFunction, Request, Response } from 'express'
import {
  createIncident,
  deleteIncident,
  getIncident,
  getIncidents,
  updateIncident
} from 'src/controllers'

import { created, errorResponse, ok, serializeIncident, serializeIncidents } from 'src/utils'

export const createIncidentView = async (req: Request, res: Response, next: NextFunction) => {
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
    const { body } = req
    const payload: IIncident = {
      monitorId: body.monitorId,
      impact: body.impact,
      status: body.status,
      cause: body.cause,
      displayName: body.displayName,
      notes: body.notes
    }

    const incident = await createIncident(payload)
    const serialized = serializeIncident(incident)

    return created(res, serialized)
  } catch (error) {
    return errorResponse(error, res, next)
  }
}
export const getIncidentView = async (req: Request, res: Response, next: NextFunction) => {
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
    const { id } = req.params || ''

    const incident = await getIncident(id)
    const serialized = serializeIncident(incident)

    return ok(res, serialized)
  } catch (error) {
    return errorResponse(error, res, next)
  }
}
export const getIncidentsView = async (req: Request, res: Response, next: NextFunction) => {
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
    const incidents = await getIncidents()
    const serialized = serializeIncidents(incidents)

    return ok(res, serialized)
  } catch (error) {
    return errorResponse(error, res, next)
  }
}
export const updateIncidentView = async (req: Request, res: Response, next: NextFunction) => {
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
    const { body, params } = req

    let id = params.id
    id = id?.toString() || ''

    const payload: Partial<IIncident> = {
      monitorId: body.monitorId,
      impact: body.impact,
      status: body.status,
      cause: body.cause,
      displayName: body.displayName,
      notes: body.notes
    }

    const incident = await updateIncident(id, payload)
    const serialized = serializeIncident(incident)

    return ok(res, serialized)
  } catch (error) {
    return errorResponse(error, res, next)
  }
}
export const deleteIncidentView = async (req: Request, res: Response, next: NextFunction) => {
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
    let { id } = req.params
    id = id?.toString() || ''

    const incident = await deleteIncident(id)
    const serialized = serializeIncident(incident)

    return ok(res, serialized)
  } catch (error) {
    return errorResponse(error, res, next)
  }
}
