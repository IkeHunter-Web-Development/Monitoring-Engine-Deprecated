import { Request, Response, NextFunction } from "express";
import MonitorManager from "../models/monitor/monitor.manager";
import { MonitorOrNull } from "../models/monitor/utils/monitor.types";
import { UserOrNull } from "../models/user/utils/user.types";
import { simpleResponse } from "../utils/responses";
import { isForceAuth, forceAuthLabels } from "../utils/forceAuth";

/**
 * Check if the user has permission to access the monitor.
 */
export const hasPermission = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.headers);
  if (isForceAuth(req, forceAuthLabels.PERMS)) return next();

  const user: UserOrNull = res.locals.user;
  if (!user) return simpleResponse(res, 400, "Bad Request");

  const monitor: MonitorOrNull = await MonitorManager.getMonitor(req.params.id);
  if (!monitor) return simpleResponse(res, 404, "Monitor not found");

  let hasPermission = await MonitorManager.userHasPermission(user, monitor);
  if (!hasPermission) return simpleResponse(res, 403, "Forbidden");

  next();
};
