/**
 * @fileoverview API controller for the monitor objects.
 */
import { type Request, type Response } from 'express'
import type { AuthLocals } from 'src/middleware'
import { WebsiteMonitor } from 'src/models'
import { createMonitor, deleteMonitor, getManyMonitorsDetails } from 'src/services'
import { validateMonitor } from 'src/validators'
import { responses } from './utils/responses'

const MonitorController = {
  createMonitor: async (req: Request, res: Response) => {
    /** ======================*
        @swagger Create monitor
        #swagger.parameters['body'] = {
          in: "body",
          name: "body",
          description: "Monitor object",
          required: true,
          schema: {$ref: "#/definitions/MonitorBody"}
        }
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for creating a monitor.'
        #swagger.responses[201] = {
          schema: { $ref: "#/definitions/MonitorResponse" },
          description: "Monitor created"
        }
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
       *======================== */
    await createMonitor(req.body)
      .then(async (monitor: any) => {
        return responses.created(res, monitor)
      })
      .catch(async (err: any) => {
        console.log(err)
        return responses.badRequest(res, err?.message ?? 'Error creating monitor')
      })
  },

  updateMonitor: async (req: Request, res: Response) => {
    /** ======================*
        @swagger Update monitor
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for updating a monitor.'
        #swagger.parameters['id'] = { description: 'Monitor ID' }
        #swagger.parameters['body'] = {
          in: "body",
          name: "body",
          description: "Monitor object",
          required: true,
          schema: {$ref: "#/definitions/MonitorBody"}
        }
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/MonitorResponse" },
            description: "Monitor updated"
        }
  
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
  
        #swagger.responses[404] = {
          schema: {$ref: "#/definitions/Error404"},
        }
       *======================= */
    const { id } = req.params ?? ''
    const payload = validateMonitor(req.body)

    // return MonitorService.updateMonitor(id, req.body)
    await WebsiteMonitor.updateOne({ _id: id }, payload)
      .then(async (monitor: WebsiteMonitor | unknown) => {
        return responses.ok(res, monitor)
      })
      .catch(async (err: any) => {
        console.log(err)
        return responses.badRequest(res, err?.message ?? 'Error updating monitor')
      })
  },

  getMonitor: async (req: Request, res: Response) => {
    /** ==========================*
        @swagger Get single monitor
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for getting a single monitor.'
        #swagger.parameters['id'] = { description: 'Monitor ID' }
        #swagger.responses[200] = {
              schema: { $ref: "#/definitions/MonitorResponse" },
              description: "Monitor updated"
          }
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
        #swagger.responses[404] = {
          schema: {$ref: "#/definitions/Error404"},
        }
       *=========================== */
    const { id } = req.params ?? ''

    await WebsiteMonitor.findById(id)
      .then(async (monitor: any) => {
        if (monitor == null) {
          return responses.notFound(res, 'Monitor not found')
        }
        return responses.ok(res, monitor)
      })
      .catch(async (err: any) => {
        console.log(err)
        return responses.badRequest(res, err?.message ?? 'Error getting monitor')
      })
  },

  deleteMonitor: async (req: Request, res: Response) => {
    /** ==========================*
        @swagger Delete single monitor
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for deleting a single monitor.'
        #swagger.parameters['id'] = { description: 'Monitor ID' }
        #swagger.responses[200] = {
          description: "Monitor deleted successfully",
          schema: {
            status: 200,
            message: "Monitor deleted"
          }
        }
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
        #swagger.responses[404] = {
          schema: {$ref: "#/definitions/Error404"},
        }
       *=========================== */
    const { id } = req.params ?? ''
    const monitor = WebsiteMonitor.findById(id)

    if (monitor == null) return responses.notFound(res, 'Monitor not found')

    await deleteMonitor(id)
      .then((success) => {
        if (!success) {
          return responses.notFound(res, 'Monitor not found')
        }
        return responses.ok(res, 'Monitor deleted')
      })
      .catch((err: any) => {
        console.log(err)
        return responses.badRequest(res, err?.message ?? 'Error deleting monitor')
      })
  },

  getMonitors: async (_: Request, res: Response) => {
    /** ==========================*
        @swagger Get all monitors
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for getting all monitors.'
        #swagger.security = [{
          "bearerAuth": []
        }]
        #swagger.responses[200] = {
          description: "Success",
          schema: [{$ref: "#/definitions/MonitorResponse"}],
        }
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
       *=========================== */
    await WebsiteMonitor.find({})
      .then(async (monitors: any) => {
        return responses.ok(res, monitors)
      })
      .catch(async (err: any) => {
        return responses.badRequest(res, err?.message)
      })
  },

  getDetailedMonitors: async (_: Request, res: Response) => {
    /** ==========================*
        @swagger Get all monitor details
        #swagger.tags = ['Monitor']
        #swagger.description = 'Endpoint for getting details for all monitors.'
        #swagger.security = [{
          "bearerAuth": []
        }]
        #swagger.responses[200] = {
          description: "Success",
          schema: [{$ref: "#/definitions/MonitorResponseDetailed"}],
        }
        #swagger.responses[500] = {
          schema: {$ref: "#/definitions/Error500"},
        }
       *=========================== */
    // responses.notImplemented(res)
    // const projectIds = <AuthLocals>res.locals.projectIds
    const { projectIds } = <AuthLocals>res.locals
    const monitors: WebsiteMonitor[] = []

    for (const projectId of projectIds) {
      const foundMonitors: WebsiteMonitor[] = await WebsiteMonitor.find({ projectId: projectId })
      monitors.push(...foundMonitors)
    }

    const detailedMonitors = await getManyMonitorsDetails(monitors)

    // const detailedMonitors: WebsiteMonitor & { responses: WebsiteResponse; incidents: Incident } =
    //   monitors.map(async (monitor) => {
    //     const responses = await WebsiteResponse.find({ monitorId: monitor._id })
    //     const incidents = await WebsiteResponse.find({ monitorId: monitor._id })

    //     return {
    //       ...monitor,
    //       responses,
    //       incidents
    //     }
    //   })

    return responses.ok(res, detailedMonitors)
  }
}

export { MonitorController }
