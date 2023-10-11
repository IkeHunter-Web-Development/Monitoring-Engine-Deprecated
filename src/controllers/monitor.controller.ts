/**
 * @fileoverview API controller for the monitor objects.
 */
import Monitor, { MonitorType } from "../models/monitor.model";
import MonitorManager from "../models/monitor.manager";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export const createMonitor = async (req: Request, res: Response) => {
  MonitorManager.createMonitor(req.body)
    .then((monitor: any) => {
      return res.status(201).json(monitor);
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const updateMonitor = async (req: Request, res: Response) => {
  const id = req.params.id || req.body._id;

  MonitorManager.updateMonitor(id, req.body)
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

export const getMonitor = async (req: Request, res: Response) => {
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
