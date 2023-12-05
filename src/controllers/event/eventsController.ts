/**
 * @fileoverview Events controller
 */
import { Request, Response } from "express";
import { Event } from "src/models";

export class EventController {
  /**============*
   * CRUD ROUTES *
   *=============*/
  static async getEvent(req: Request, res: Response) {
    /**==========================*
    @swagger Get single event.
    #swagger.tags = ['Events']
    #swagger.description = 'Endpoint for getting a single event.'
    #swagger.parameters['id'] = { description: 'Event ID' }
    #swagger.responses[200] = {
      description: "Success",
      schema: { $ref: "#/definitions/EventResponse" },
    }
    #swagger.responses[500] = {
      schema: {$ref: "#/definitions/Error500"}
    }
    #swagger.responses[404] = {
      schema: {$ref: "#/definitions/Error404"}
    }
   *===========================*/
    const id = req.params["id"] || "";

    let event = await Event.findById(id);

    if (!event)
      return res.status(404).json({
        status: 404,
        message: "Event not found",
      });

    return res.json(event);
  }

  static async deleteEvent(req: Request, res: Response) {
    /**==========================*
      @swagger Get single event.
      #swagger.tags = ['Events']
      #swagger.description = 'Endpoint for deleting a single event.'
      #swagger.parameters['id'] = { description: 'Event ID' }
      #swagger.responses[200] = {
        description: "Success",
        schema: { 
          status: 200,
          message: "Event deleted"
        },
      }
      #swagger.responses[500] = {
        schema: {$ref: "#/definitions/Error500"}
      }
      #swagger.responses[404] = {
        schema: {$ref: "#/definitions/Error404"}
      }
     *===========================*/
    const id = req.params["id"] || "";

    try {
      let event = await Event.deleteOne({ _id: id });

      if (!event)
        return res.status(404).json({
          status: 404,
          message: "Event not found",
        });

      return res.json({
        status: 200,
        message: "Event deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: error,
      });
    }
  }

  /**==============*
   * SEARCH ROUTES *
   *===============*/
  static async searchEvents(req: Request, res: Response) {
    /**==========================*
    @swagger Get single event.
    #swagger.tags = ['Events']
    #swagger.description = 'Endpoint for searching events.'
    #swagger.parameters['monitor'] = { description: 'Monitor ID' }
    #swagger.parameters['online'] = { 
      description: 'Online status',
      type: 'boolean' 
    }
    #swagger.parameters['last'] = { 
      description: 'Last event',
      type: 'boolean'
    }
    #swagger.responses[200] = {
      description: "Success",
      schema: [{$ref: "#/definitions/EventResponse"}],
    }
    #swagger.responses[500] = {
      schema: {$ref: "#/definitions/Error500"}
    }
    #swagger.responses[404] = {
      schema: {$ref: "#/definitions/Error404"}
    }
   *===========================*/
    const params = req.query || {};

    let events: Array<Event> = [];

    try {
      events = await Event.find({ monitorId: params["monitor"] });

      let online = params["online"] || null;
      if (online != null) {
        events = events.filter((event: Event) => {
          return event.online === Boolean(online);
        });
      }

      let last = params["last"] || null;
      if (last) {
        events = events.sort((a: Event, b: Event) => {
          return b.timestamp.getTime() - a.timestamp.getTime();
        });

        events = [events[0]];
      }
      return res.json(events || []);
    } catch (error) {
      return res.json({
        status: 500,
        message: error,
      });
    }
  }
}

// TODO: Get the latest 30 day report
// export const getReport = (req: Request, res: Response) => {};
