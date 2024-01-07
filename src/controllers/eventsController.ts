/**
 * @fileoverview Events controller
 */
// import { type Request, type Response } from 'express'
// import { Event } from 'src/models'
// import * as responses from './baseController'
// import { EventService } from 'src/services'
// import { BaseController } from './baseController'

export const EventController = {
  /** ============*
   * CRUD ROUTES *
   *============= */
  // async getEvent (req: Request, res: Response) {
  //   /** ==========================*
  //   @swagger Get single event.
  //   #swagger.tags = ['Events']
  //   #swagger.description = 'Endpoint for getting a single event.'
  //   #swagger.parameters['id'] = { description: 'Event ID' }
  //   #swagger.responses[200] = {
  //     description: "Success",
  //     schema: { $ref: "#/definitions/EventResponse" },
  //   }
  //   #swagger.responses[500] = {
  //     schema: {$ref: "#/definitions/Error500"}
  //   }
  //   #swagger.responses[404] = {
  //     schema: {$ref: "#/definitions/Error404"}
  //   }
  //  *=========================== */
  //   const { id } = req.params ?? ''

  //   const event = await Event.findById(id)
  //   if (event == null) return await responses.notFound(res, 'Event not found')

  //   return await responses.ok(res, event)
  // },

  // async deleteEvent (req: Request, res: Response) {
  //   /** ==========================*
  //     @swagger Get single event.
  //     #swagger.tags = ['Events']
  //     #swagger.description = 'Endpoint for deleting a single event.'
  //     #swagger.parameters['id'] = { description: 'Event ID' }
  //     #swagger.responses[200] = {
  //       description: "Success",
  //       schema: {
  //         status: 200,
  //         message: "Event deleted"
  //       },
  //     }
  //     #swagger.responses[500] = {
  //       schema: {$ref: "#/definitions/Error500"}
  //     }
  //     #swagger.responses[404] = {
  //       schema: {$ref: "#/definitions/Error404"}
  //     }
  //    *=========================== */
  //   const { id } = req.params ?? ''

  //   try {
  //     const event = await Event.deleteOne({ _id: id })

  //     if (event == null) return await responses.notFound(res, 'Event not found')

  //     return await responses.ok(res, 'Event deleted')
  //   } catch (err: any) {
  //     console.log(err)
  //     return await responses.badRequest(res, String(err.message) ?? 'Error deleting event')
  //   }
  // },

  /** ==============*
   * SEARCH ROUTES *
   *=============== */
  // async searchEvents (req: Request, res: Response) {
  //   /** ==========================*
  //   @swagger Get single event.
  //   #swagger.tags = ['Events']
  //   #swagger.description = 'Endpoint for searching events.'
  //   #swagger.parameters['monitor'] = { description: 'Monitor ID' }
  //   #swagger.parameters['online'] = {
  //     description: 'Online status',
  //     type: 'boolean'
  //   }
  //   #swagger.parameters['last'] = {
  //     description: 'Last event',
  //     type: 'boolean'
  //   }
  //   #swagger.responses[200] = {
  //     description: "Success",
  //     schema: [{$ref: "#/definitions/EventResponse"}],
  //   }
  //   #swagger.responses[500] = {
  //     schema: {$ref: "#/definitions/Error500"}
  //   }
  //   #swagger.responses[404] = {
  //     schema: {$ref: "#/definitions/Error404"}
  //   }
  //  *=========================== */
  //   const params = req.query ?? {}
  //   const { monitor, online, last } = params

  //   let events: Event[] = []

  //   try {
  //     events = await Event.find({ monitorId: monitor })

  //     if (online != null) {
  //       events = events.filter((event: Event) => {
  //         return event.status === 'online'
  //       })
  //     }

  //     if (last) {
  //       events = events.sort((a: Event, b: Event) => {
  //         return b.timestamp.getTime() - a.timestamp.getTime()
  //       })

  //       events = [events[0]]
  //     }

  //     return await responses.ok(res, events || [])
  //   } catch (err: any) {
  //     return await responses.badRequest(res, err?.message)
  //   }
  // },

  // async createEvent (req: Request, res: Response) {
  //   /** ======================*
  //     @swagger Register Event
  //     #swagger.security = [{
  //       "bearerAuth": []
  //     }]
  //     #swagger.parameters['body'] = {
  //       in: "body",
  //       name: "body",
  //       description: "Event object",
  //       required: true,
  //       schema: {$ref: "#/definitions/EventBody"}
  //     }
  //     #swagger.tags = ['Events']
  //     #swagger.description = 'Endpoint for creating an Event.'
  //     #swagger.responses[201] = {
  //       schema: { $ref: "#/definitions/EventResponse" },
  //       description: "Event created"
  //     }
  //     #swagger.responses[500] = {
  //       schema: {$ref: "#/definitions/Error500"},
  //     }
  //    *======================== */
  //   await EventService.createEvent(req.body)
  //     .then(async (event) => {
  //       return await responses.ok(res, event)
  //     })
  //     .catch(async (error: any) => {
  //       return await responses.badRequest(res, error?.message)
  //     })
  // }
}
