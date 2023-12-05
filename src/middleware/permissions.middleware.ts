import { Request, Response, NextFunction } from "express";
import MonitorManager from "../services/monitor";
import { MonitorOrNull } from "../models/monitor/monitor.types";
import { UserOrNull } from "../models/user/types";
import { simpleResponse } from "../utils/responses";

/**
 * Check if the user has permission to access the monitor.
 */
export const hasPermission = async (req: Request, res: Response, next: NextFunction) => {
  const user: UserOrNull = res.locals.user;
  if (!user) return simpleResponse(res, 400, "Bad Request");

  const monitor: MonitorOrNull = await MonitorManager.getMonitor(req.params.id);
  if (!monitor) return simpleResponse(res, 404, "Monitor not found");

  let hasPermission = await MonitorManager.userHasPermission(user, monitor);
  if (!hasPermission) return simpleResponse(res, 403, "Forbidden");

  next();
};
