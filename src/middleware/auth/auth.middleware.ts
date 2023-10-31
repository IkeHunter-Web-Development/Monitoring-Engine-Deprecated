/**
 * @fileoverview Check if a user is logged in, if not,
 * check auth service to see if they are logged in with SSO,
 * and if that's not the case, redirect them to the auth service.
 */

import { NextFunction, Request, Response } from "express";
import UserManager from "../../models/user/user.manager";
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
      throw noTokenError;
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) throw noTokenError;

    let user = await UserManager.getUserByToken(token).catch((err: any) => {
      throw err;
    });

    if (!user) {
      let authRes: AuthServiceResponse | null = await verifyUser(token)
        .then((data: AuthServiceResponse) => {
          return data;
        })
        .catch((err: any) => {
          throw new Error("Error verifying user");
        });

      if (!authRes) throw new Error("Error verifying token");
      if (authRes.status !== 200) throw unauthorizedError;

      let payload = {
        ...authRes,
        token: token,
      };

      await UserManager.createOrUpdateUser(authRes.userId, payload).catch((err: any) => {
        throw err;
      });

      // await UserManager.createUser(authRes.userId, authRes.email, token).catch((err: any) => {
      //   console.log("Error creating user: ", err);
      //   throw err;
      // });
    }

    next();
  } catch (err: any) {
    if (err.message === unauthorizedError.message) {
      res.status(401).json(errUnauthorized);
    } else if (err.message === noTokenError.message) {
      res.status(401).json(errNoToken);
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};
