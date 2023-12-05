/**
 * @fileoverview Tests for authentication middleware.
 */

import { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../auth.middleware";
import { errNoToken } from "../utilities/auth.utilities";
import { User } from "src/models";

describe("Authorization middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  // let mockUser: User;
  let defaultHeaders = {
    // "force-auth": forceAuthLabels.PERMS,
  };

  beforeEach(async () => {
    // let userManager = new UserManager();
    mockRequest = {
      headers: {
        ...defaultHeaders,
      },
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    
    // mockUser = await User.create({ userId: "abc123", email: "user@example.com" });
  });

  test("without headers", async () => {
    const expectedResponse = errNoToken;

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  // TODO:
  // test("with header, invalid token", async () => {
  //   const expectedResponse = errUnauthorized;
  //   mockRequest = {
  //     headers: {
  //       ...defaultHeaders,
  //       authorization: "Bearer " + invalidToken,
  //     },
  //   };

  //   await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

  //   expect(nextFunction).not.toBeCalled();
  //   expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  // });

  test("with header, valid token, user not in db", async () => {
    mockRequest = {
      headers: {
        ...defaultHeaders,
        authorization: "Bearer validToken",
      },
    };

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });

  test("with header, valid token, user in db", async () => {
    const token = "validToken";
    // let newUser = UserManager.createUser("def456", "user@example.com", { token: token });
    User.create({ userId: "def456", email: "user@example.com", token: token });

    mockRequest = {
      headers: {
        ...defaultHeaders,
        authorization: "Bearer " + token,
      },
    };

    await isAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });
});
