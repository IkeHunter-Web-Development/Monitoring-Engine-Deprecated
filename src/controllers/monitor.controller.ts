/**
 * @fileoverview API controller for the monitor objects.
 */
import Monitor from "../models/monitor.model";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';

type MonitorType = InstanceType<typeof Monitor>;

export const createMonitor = async (req: Request, res: Response) => {
  let payload = {
    projectId: req.body.projectId || "",
    url: req.body.url || "",
    users: req.body.users || [],
    title: req.body.title || "",
  };

  await Monitor.create(payload)
    .then((monitor: MonitorType) => {
      return res.status(201).json(monitor);
    })
    .catch((err: mongoose.Error) => {
      console.log(err);
      return res.status(500).json(err);
    }); 
};

export const updateMonitor = async (req: Request, res: Response) => {
  const id = req.params.id || req.body._id;

  await Monitor.updateOne({ _id: id }, req.body)
    .then((monitor: any) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
    })
    .catch((err: mongoose.Error) => { 
      console.log(err);
      return res.status(500).json(err);
    });

  let monitor = await Monitor.findOne({ _id: id });

  return res.status(200).json(monitor);
};

export const getMonitor = async (req: Request, res: Response) => {
  const id = req.params.id || "";

  await Monitor.findOne({ _id: id })
    .then((monitor: any) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
      return res.status(200).json(monitor);
    })
    .catch((err: mongoose.Error) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const deleteMonitor = async (req: Request, res: Response) => {
  const id = req.params.id || "";

  await Monitor.deleteOne({ _id: id })
    .then(() => {
      return res.status(200).json({ message: "Monitor deleted" });
    })
    .catch((err: mongoose.Error) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const getMonitors = async (req: Request, res: Response) => {
  await Monitor.find({ active: true })
    .then((monitors: any) => {
      return res.status(200).json(monitors);
    })
    .catch((err: mongoose.Error) => {
      return res.status(500).json(err);
    });
};
