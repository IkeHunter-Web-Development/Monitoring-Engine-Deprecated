/**
 * @fileoverview Utility functions for authentication middleware.
 */
// import UserManager from "../../models/user/user.manager";
import User from "../../models/user/user.model";
import "dotenv/config";

/** Error message if no token provided */
export const errNoToken = { message: "No token, authorization denied" };
/** Unit testing, force token to be invalid */
export const invalidToken = "invalidToken";
/** Error message if token unauthorized */
export const errUnauthorized = { message: "Unauthorized" };
/** Error message if token invalid */
export const errInvalidToken = { message: "Invalid token" };

export interface AuthServiceResponse {
  status: number;
  userId: string;
  email: string;
}

/**
 * Verify user if connected to network,
 * otherwise mock verification process.
 *
 * @param token Authorization token (without bearer string)
 * @returns object representing user data returned from auth service
 */
export const verifyUser = async (token: string): Promise<AuthServiceResponse> => {
  let data: AuthServiceResponse = {
    status: 200,
    userId: "",
    email: "",
  };

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "network") {
    console.log("Verifying user with auth service, token: ", token);
    let authRes: any = await fetch(process.env.AUTH_SERVICE_URL + "/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data.status = authRes.status;
    if (authRes.status !== 200) return data;

    try {
      (data.userId = authRes.userId), (data.email = authRes.email);
    } catch (error) {
      console.log(error);
      data.userId = "";
      data.email = "";
      return data;
    }
  } else {
    if (token === invalidToken) {
      data.status = 401;
      return data;
    }

    // const randomUser = await UserManager.getRandomUser();
    // const randomUser = await

    // if (!randomUser) throw new Error("Error mocking user request.");

    // data.userId = randomUser.userId;
    // data.email = randomUser.email;
    // data.status = 200;

    // return data;
  }
  return data;
};
