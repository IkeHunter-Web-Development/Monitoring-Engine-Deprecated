/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */

import { NextFunction, Request, Response } from "express";
import { NETWORK_TOKEN, NODE_ENV } from "src/config";
// import { NODE_ENV } from "src/config";
// import { verifyToken } from "src/lib";
import { Network } from "src/network";
import { NetworkAuthResponse } from "src/network/types/network";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  /**
    #swagger.security = [{
        "bearerAuth": []
    }]
   */
  if (NODE_ENV === "development") return next();

  // TODO: Create secure authorization protocol for microservices
  const networkToken = <string>req.headers["x-network-authorization"];
  if (networkToken === NETWORK_TOKEN) return next();

  const userToken = <string>req.headers["authorization"]?.split(" ")[1];

  if (!userToken)
    return res.status(401).json({
      status: 401,
      message: "User not logged in",
    });

  const networkRes: NetworkAuthResponse = await Network.authenticate(userToken);

  if (networkRes.status !== 200 || !networkRes.userId)
    return res.status(401).json({
      status: 401,
      message: "Invalid network token",
    });

  res.locals = { ...res.locals, token: userToken };

  return next();
};
