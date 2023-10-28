/**
 * @fileoverview Tests for authentication middleware.
 */
import request from "supertest";
import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "./auth.middleware";
import { errInvalidToken, errNoToken, errUnauthorized, invalidToken } from "./auth.utilities";
import User, { UserType } from "../models/user/user.model";
import UserManager from "../models/user/user.manager";
import "dotenv/config";

describe("Authorization middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let mockUser: typeof User;

  beforeEach(async () => {
    let userManager = new UserManager();
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      // status: jest.fn(),
    };

    // mockUser = await User.create({
    //   userId: "abc123",
    //   email: "user@example.com",
    // });
    mockUser = await UserManager.createUser("abc123", "user@example.com");
  });

  test("without headers", async () => {
    const expectedResponse = errNoToken;

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("with header, invalid token", async () => {
    // const expectedResponse = errUnauthorized;
    const expectedResponse = errUnauthorized;
    mockRequest = {
      headers: {
        authorization: "Bearer " + invalidToken,
      },
    };

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).not.toBeCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("with header, valid token", async () => {
    mockRequest = {
      headers: {
        authorization: "Bearer validToken",
      },
    };
    console.log("user in test: ", mockUser);

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });
});
