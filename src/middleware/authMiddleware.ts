/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */

import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "src/config";
import { verifyToken } from "src/lib";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next();
  const token = <string>req.headers["authorization"];

  try {
    const payload = verifyToken(token);
    res.locals = { ...res.locals, token: payload };
  } catch (error) {
    return res.status(401).send("Invalid token");
  }

  return next();
};
