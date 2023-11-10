import { NextFunction, Request } from "express";

export enum forceAuthLabels {
  ALL = "all",
  PERMS = "perms",
  AUTH = "auth",
}

export const forceAuthHeader = {
  name: "Force-Auth",
  value: "all",
};

export const isForceAuth = (req: Request, label: forceAuthLabels = forceAuthLabels.ALL) => {
  try {
    let forceAuth = req.headers["force-auth"];
    let isForceAuth = forceAuth === label || forceAuth === forceAuthLabels.ALL;

    if (isForceAuth && process.env.NODE_ENV === "development") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
