import { Request, Response, NextFunction } from "express";
import { simpleResponse } from "../utils/responses";
import { Monitor, User } from "src/models";
import { MonitorService } from "src/services";

/**
 * Check if the user has permission to access the monitor.
 */
export const hasPermission = async (req: Request, res: Response, next: NextFunction) => {
  const user: User | null = res.locals['user'];
  if (!user) return simpleResponse(res, 400, "Bad Request");

  const monitor: Monitor | null = await MonitorService.getMonitor(req.params['id']);
  if (!monitor) return simpleResponse(res, 404, "Monitor not found");

  let hasPermission = await MonitorService.userHasPermission(user, monitor);
  if (!hasPermission) return simpleResponse(res, 403, "Forbidden");

  next();
};
