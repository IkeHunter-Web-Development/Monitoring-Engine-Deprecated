/**
 * @fileoverview Events controller
 */
import { Request, Response } from 'express';
import EventManager from '../models/event.manager';

/**============*
 * CRUD ROUTES *
 *=============*/
export const getEvent = async (req: Request, res: Response) => {
  const id = req.params.id || '';

  EventManager.getEvent(id)
    .then((event: any) => {
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(200).json(event);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id || '';

  EventManager.deleteEvent(id)
    .then(() => {
      return res.status(200).json({ message: 'Event deleted' });
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
  const params = req.query || {};
  
  EventManager.searchEvents(params)
    .then((events: any) => {
      return res.status(200).json(events);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
}