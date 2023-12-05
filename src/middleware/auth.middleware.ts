/**
 * @fileoverview Check if a user is logged in, if not,
 * check auth service to see if they are logged in with SSO,
 * and if that's not the case, redirect them to the auth service.
 */
import { NextFunction, Request, Response } from "express";
import {
  errNoToken,
  errUnauthorized,
  AuthServiceResponse,
  verifyUser,
} from "./utilities/auth.utilities";
import { User } from "src/models";
// import { UserOrNull } from "src/models/user/types";
// import User from "../models/user/model";

const unauthorizedError = new Error(errUnauthorized.message);
const noTokenError = new Error(errNoToken.message);

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * Get token from header
   *  if not present -> redirect to auth service
   *  if is present, not in db -> authenticate token with auth service, store in db
   *  if is present, is in db -> next()
   */
  if (!req.headers) return res.status(401).json(errNoToken);

  try {
    if (!req.headers || !req.headers["authorization"]) {
      throw noTokenError;
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) throw noTokenError;

    let user: User | null;

    user = await User.find({ toke: token }).then((user: any) => {
      if (!user) throw noTokenError;
      return user;
    });

    if (!user) {
      let authRes: AuthServiceResponse | null = await verifyUser(token)
        .then((data: AuthServiceResponse) => {
          return data;
        })
        .catch((err: any) => {
          throw new Error("Error verifying user: " + err.message);
        });

      if (!authRes) throw new Error("Error verifying token");
      if (authRes.status !== 200) throw unauthorizedError;

      // TODO: How to handle authorized, but unregistered users
      // user = await UserManager.createOrUpdateUser(authRes.userId, payload).catch((err: any) => {
      //   console.log("Error creating or updating user: ", err);
      //   throw err;
      // });
    }

    res.locals = { ...res.locals, user: user };

    return next();
  } catch (err: any) {
    if (err.message === unauthorizedError.message) {
      return res.status(401).json(errUnauthorized);
    } else if (err.message === noTokenError.message) {
      return res.status(401).json(errNoToken);
    } else {
      console.log("Error: ", err);
      return res.status(500).json({ message: err.message });
    }
  }
};
