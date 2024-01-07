/**
 * @fileoverview API controller for the monitor objects.
 */
import { type Request, type Response } from 'express'
import { MonitorService } from '../services/monitorService'
import { responses } from './baseController'
// import { BaseController } from './baseController'
// import _ from 'lodash'
import { Monitor, type IMonitor } from 'src/models'
import { validateMonitor } from 'src/validators'

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
    // return res
    await MonitorService.createMonitor(req.body)
      .then(async (monitor: any) => {
        // return res.status(201).json(monitor);
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
    const payload: IMonitor = validateMonitor(req.body)

    // return MonitorService.updateMonitor(id, req.body)
    await Monitor.updateOne({ _id: id }, payload)
      .then(async (monitor: Monitor | unknown) => {
        // if (!(monitor instanceof Monitor)) {
        //   console.log('monitor not found:', id)
        //   return responses.notFound(res, 'Monitor not found')
        // }
        // const { token } = res.locals ?? ''
        // const detailed = await MonitorService.getMonitorDetails(String(token), monitor)

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

    // return MonitorService.getMonitor(id)
    await Monitor.findById(id)
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
    // const monitor = await MonitorService.getMonitor(id)
    const monitor = Monitor.findById(id)

    if (monitor == null) return responses.notFound(res, 'Monitor not found')

    await MonitorService.deleteMonitor(id)
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
    await Monitor.find({})
      .then(async (monitors: any) => {
        return responses.ok(res, monitors)
      })
      .catch(async (err: any) => {
        return responses.badRequest(res, err?.message)
      })
  },

  // searchMonitors: async (req: Request, res: Response): void => {
  //   /** ================================*
  //       @swagger Search monitors by query
  //       #swagger.tags = ['Monitor']
  //       #swagger.description = 'Endpoint for searching monitors.'
  //       #swagger.parameters['project'] = { description: 'Project ID' }
  //       #swagger.parameters['user'] = { description: 'User ID' }
  //       #swagger.responses[200] = {
  //         description: "Success",
  //         schema: [{$ref: "#/definitions/MonitorResponse"}],
  //       }
  //       #swagger.responses[500] = {
  //         schema: {$ref: "#/definitions/Error500"},
  //       }
  //       #swagger.responses[404] = {
  //         schema: {$ref: "#/definitions/Error404"},
  //       }
  //      *================================= */
  //   const params = req.query || {}

  //   return MonitorService.searchMonitors(params)
  //     .then(async (monitors: any) => {
  //       if (!monitors) return await responses.notFound(res, 'No monitors found')

  //       return await responses.ok(res, monitors)
  //     })
  //     .catch(async (err: any) => {
  //       console.log(err)
  //       return await responses.badRequest(res, err?.message ?? 'Error searching monitors')
  //     })
  // },

  // getMonitorOnlineStatus: async (req: Request, res: Response): void => {
  //   /** =================================*
  //       @swagger Get monitor online status
  //       #swagger.tags = ['Monitor']
  //       #swagger.description = 'Endpoint for getting online status for monitor.'
  //       #swagger.parameters['id'] = { description: 'Monitor ID' }
  //       #swagger.responses[200] = {
  //         description: "True if online, false if offline",
  //       }
  //       #swagger.responses[500] = {
  //         schema: {$ref: "#/definitions/Error500"},
  //       }
  //       #swagger.responses[404] = {
  //         schema: {$ref: "#/definitions/Error404"},
  //       }
  //      *================================== */
  //   const { id } = req.params || ''

  //   const monitor = await MonitorService.getMonitor(id)

  //   if (!monitor) {
  //     return await responses.notFound(res, 'Monitor not found')
  //   }

  //   if (!monitor.online) {
  //     return res.status(200).send(false)
  //   } else {
  //     return res.status(200).send(true)
  //   }
  // },

  // alertMonitor: async (req: Request, res: Response): void => {
  //   /** =================================*
  //       @swagger Alert monitor down
  //       #swagger.tags = ['Monitor']
  //       #swagger.description = 'Endpoint for alerting service that a monitor is down.'
  //       #swagger.parameters['body'] = {
  //         in: "body",
  //         name: "body",
  //         description: "Alert payload",
  //         required: true,
  //         schema: {
  //           id: "monitor-id",
  //           statusCode: 500,
  //           error: "Website experienced an internal server error",
  //         }
  //       }
  //       #swagger.responses[200] = {
  //         description: "Alert received",
  //       }
  //       #swagger.responses[500] = {
  //         schema: {$ref: "#/definitions/Error500"},
  //       }
  //       #swagger.responses[404] = {
  //         schema: {$ref: "#/definitions/Error404"},
  //       }
  //      *================================== */
  //   const { id, statusCode, stable, message } = req.body

  //   const monitor = await MonitorService.getMonitor(id)

  //   if (!monitor) return await responses.notFound(res, 'Monitor not found')

  //   if (stable === true) {
  //     const success = MonitorService.handleMonitorBackOnline(monitor, statusCode)
  //     if (!success) return await responses.badRequest(res, 'Error handling monitor back online')
  //   } else {
  //     const success = MonitorService.handleMonitorDown(monitor, statusCode, message)
  //     if (!success) return await responses.badRequest(res, 'Error handling monitor down')
  //   }

  //   return await responses.ok(res, 'Alert received')
  // },

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
    // const token = String(res.locals?.token) ?? ''
    responses.notImplemented(res)
    // return res.status(200).send()
    // MonitorService.getDetailedMonitors(token)
    //   .then((monitors) => {
    //     return responses.ok(res, monitors)
    //   })
    //   .catch(async (err) => {
    //     return responses.badRequest(res, err?.message)
    //   })
  }
}

// export default MonitorController;
export { MonitorController }
