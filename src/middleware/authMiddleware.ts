/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */

import { NextFunction, Request, Response } from "express";
// import { NODE_ENV } from "src/config";
// import { verifyToken } from "src/lib";
import { Network } from "src/network";
import { NetworkAuthResponse } from "src/network/types/network";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // if (NODE_ENV === "development") return next();
  // const token = <string>req.headers["x-ms-authorization"];
  // const payload = verifyToken(token);

  // if (!payload) {
  // console.log('req.headers', req.headers)
  const networkToken = <string>req.headers["authorization"]?.split(" ")[1];

  if (!networkToken)
    return res.status(401).json({
      status: 401,
      message: "User not logged in",
    });

  const networkRes: NetworkAuthResponse = await Network.authenticate(networkToken);

  if (networkRes.status !== 200 || !networkRes.userId)
    return res.status(401).json({
      status: 401,
      message: "Invalid network token",
    });

  res.locals = { ...res.locals, token: networkToken };

  return next();
};
