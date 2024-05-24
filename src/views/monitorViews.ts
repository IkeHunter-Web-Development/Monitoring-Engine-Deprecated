import type { NextFunction, Request, Response } from 'express'
import {
  createWebMonitor,
  deleteWebMonitor,
  deleteWebMonitors,
  getWebMonitor,
  getWebMonitors,
  updateWebMonitor
} from 'src/controllers'

import { Responses, sendError, serializeMonitor, serializeMonitors } from 'src/utils'

export const createMonitorView = async (req: Request, res: Response, next: NextFunction) => {
  /**======================
    @swagger Create Monitor
    #swagger.summary = 'Create new monitor'
    #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Monitor object",
      required: true,
      schema: {$ref: "#/definitions/MonitorDoc"}
    }
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for creating a monitor.'
    #swagger.responses[201] = {
      schema: { $ref: "#/definitions/MonitorMetaDoc" },
      description: "Monitor created"
    }
   *======================*/
  try {
    const { body } = req
    const input: IWebsiteMonitor = {
      projectId: body.projectId,
      name: body.name,
      interval: body.interval,
      icon: body.icon,
      active: body.active,
      reminderIntervals: body.reminderIntervals,
      subscribers: body.subscribers?.map((sub: any) => ({
        displayName: sub?.displayName,
        email: sub?.email,
        phone: sub?.phone,
        method: sub?.method,
        userId: sub?.userId
      })),
      url: body.url,
      checkType: body.checkType,
      retries: body.retries,
      timeout: body.timeout
    }

    const monitor = await createWebMonitor(input)
    const serialized = await serializeMonitor(monitor)

    return Responses.created(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}

export const getMonitorsView = async (req: Request, res: Response, next: NextFunction) => {
  /** ==========================*
    @swagger Get monitors
    #swagger.summary = 'Get monitors'
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for getting all monitors.'
    #swagger.responses[200] = {
      schema: [{ $ref: "#/definitions/MonitorMetaDoc" }],
      description: "Monitors"
    }
   *=========================== */
  try {
    const monitors = await getWebMonitors(req.query)
    const serialized = await serializeMonitors(monitors)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}
export const getMonitorView = async (req: Request, res: Response, next: NextFunction) => {
  /** ==========================*
    @swagger Get single monitor
    #swagger.summary = 'Get single monitor'
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for getting a single monitor.'
    #swagger.parameters['id'] = { description: 'Monitor ID' }
    #swagger.responses[200] = {
          schema: { $ref: "#/definitions/MonitorMetaDoc" },
          description: "Monitor updated"
      }
    #swagger.responses[500] = {
      schema: {$ref: "#/definitions/Error500"},
    }
    #swagger.responses[404] = {
      schema: {$ref: "#/definitions/Error404"},
    }
   *=========================== */
  try {
    const { id } = req.params ?? ''

    const monitor = await getWebMonitor(id)
    const serialized = await serializeMonitor(monitor)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}

export const updateMonitorView = async (req: Request, res: Response, next: NextFunction) => {
  /** ======================*
    @swagger Update monitor
    #swagger.summary = 'Update monitor'
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for updating a monitor.'
    #swagger.parameters['id'] = { description: 'Monitor ID' }
    #swagger.parameters['body'] = {
      in: "body",
      name: "body",
      description: "Monitor object",
      required: true,
      schema: {$ref: "#/definitions/MonitorDoc"}
    }
    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/MonitorMetaDoc" },
        description: "Monitor updated"
    }
    *======================= */
  try {
    const { body, params } = req

    let id = params.id
    id = id?.toString() || ''

    const input: Partial<IWebsiteMonitor> = {
      projectId: body.projectId,
      name: body.name,
      interval: body.interval,
      icon: body.icon,
      active: body.active,
      reminderIntervals: body.reminderIntervals,
      subscribers: body.subscribers,
      url: body.url,
      checkType: body.checkType,
      retries: body.retries,
      timeout: body.timeout
    }

    const monitor = await updateWebMonitor(id, input)
    const serialized = await serializeMonitor(monitor)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}
export const deleteMonitorView = async (req: Request, res: Response, next: NextFunction) => {
  /** ==========================*
    @swagger Delete single monitor
    #swagger.summary = 'Delete monitor'
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for deleting a single monitor.'
    #swagger.parameters['id'] = { description: 'Monitor ID' }
    #swagger.responses[200] = {
      description: "Monitor deleted successfully",
      schema: {$ref: "#/definitions/MonitorMetaDoc"}
    }
    *=========================== */
  try {
    let { id } = req.params
    id = id?.toString() || ''

    const monitor = await deleteWebMonitor(id)
    const serialized = await serializeMonitor(monitor)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}

export const deleteMonitorsView = async (req: Request, res: Response, next: NextFunction) => {
  /** ==========================*
    @swagger Delete multiple monitors
    #swagger.summary = 'Delete monitors'
    #swagger.tags = ['Monitor']
    #swagger.description = 'Endpoint for deleting multiple monitors.'
    #swagger.parameters['q'] = { description: 'Query' }
    #swagger.responses[200] = {
      description: "Monitors that were deleted successfully.",
      schema: {$ref: "#/definitions/MonitorMetaDoc"}
    }
    *=========================== */
  try {
    const monitors = await deleteWebMonitors(req.query)
    const serialized = await serializeMonitors(monitors)

    return Responses.ok(res, serialized)
  } catch (error) {
    return sendError(error, res, next)
  }
}
