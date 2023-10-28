/**
 * @fileoverview Check if a user is logged in, if not,
 * check auth service to see if they are logged in with SSO,
 * and if that's not the case, redirect them to the auth service.
 */

import { NextFunction, Request, Response } from "express";
import UserManager from "../models/user/user.manager";
import {
  errNoToken,
  errUnauthorized,
  AuthServiceResponse,
  verifyUser,
  errInvalidToken,
} from "./auth.utilities";

const unauthorizedError = new Error(errUnauthorized.message);
const noTokenError = new Error(errNoToken.message);

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * Get token from header
   *  if not present -> redirect to auth service
   *  if is present, not in db -> authenticate token with auth service, store in db
   *  if is present, is in db -> next()
   */
  // if (!req.headers) return res.status(401).json(errNoToken);
  try {
    if (!req.headers || !req.headers["authorization"]) {
      // res.status(401).json(errNoToken);
      // return next(res.status(401).json(errNoToken));
      throw noTokenError;
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token: ", token);

    // if (!token) return next(res.status(401).json(errNoToken));
    if (!token) throw noTokenError;

    let user = await UserManager.getUserByToken(token).catch((err: any) => {
      console.log("Error getting user by token: ", err);

      // return null;
      throw err;
    });

    if (!user) {
      let authRes: AuthServiceResponse | null = await verifyUser(token)
        .then((data: AuthServiceResponse) => {
          console.log("Data: ", data);
          return data;
        })
        .catch((err: any) => {
          console.log("Error verifying user: ", err);
          // return null;
          // throw err;
          throw new Error("Error verifying user");
        });

      // if (!authRes) return next(res.status(500).json({ message: "Error verifying token" }));
      // if (authRes.status !== 200) return next(res.status(authRes.status).json(errUnauthorized));
      if (!authRes) throw new Error("Error verifying token");
      if (authRes.status !== 200) {
        console.log("auth res status: ", authRes.status);
        throw unauthorizedError;
      }

      await UserManager.createUser(authRes.userId, authRes.email, token).catch((err: any) => {
        console.log("Error creating user: ", err);
        // return null;
        throw err;
      });
    } else {
      console.log("User found: ", user);
    }
    
    next();
  } catch (err: any) {
    console.log("Error in auth middleware: ", err);

    if (err.message === unauthorizedError.message) {
      res.status(401).json(errUnauthorized);
      // return res.status(401).json({
      //   message: errUnauthorized.message,
      // });
    } else if (err.message === noTokenError.message) {
      res.status(401).json(errNoToken);
      // return res.status(401).json({
      //   message: errNoToken.message,
      // });
    } else {
      // return res.status(500).json({ message: err.message });
      res.status(500).json({ message: err.message });
    }
  }
};
