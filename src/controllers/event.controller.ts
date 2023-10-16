/**
 * @fileoverview Events controller
 */
import { Request, Response } from "express";
import EventManager from "../models/event.manager";

/**============*
 * CRUD ROUTES *
 *=============*/
export const getEvent = async (req: Request, res: Response) => {
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
  const id = req.params.id || "";

  EventManager.getEvent(id)
    .then((event: any) => {
      if (!event) {
        return res.status(404).json({
          status: 404,
          message: "Event not found",
        });
      }
      return res.status(200).json(event);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json({
        status: 500,
        message: err.message,
      });
    });
};

export const deleteEvent = async (req: Request, res: Response) => {
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
  const id = req.params.id || "";

  EventManager.deleteEvent(id)
    .then((sucess: boolean) => {
      if (!sucess) {
        return res.status(404).json({
          status: 404,
          message: "Event not found",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Event deleted",
      });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

/**==============*
 * SEARCH ROUTES *
 *===============*/
export const searchEvents = async (req: Request, res: Response) => {
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

  EventManager.searchEvents(params)
    .then((events: any) => {
      if (!events)
        return res.status(404).json({
          status: 404,
          message: "No events found",
        });
      return res.status(200).json(events);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};
