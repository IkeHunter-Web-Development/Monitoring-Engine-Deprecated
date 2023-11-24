import { UserType, UserPromise, UsersPromise } from "./user.types";
// import UserManager from "../user.manager";
import { generateRandomString } from "../../../../utils/utils";
import User from "../user.model";

export const generateSampleUser = async (data: any = {}): UserPromise => {
  let payload = {
    userId: data.userId || "aasdf8sdf83828",
    email: data.email || "user@example.com",
    token: data.token || "skdlf7asd98f7sk2h3k2jh2klhlhk",
    projectIds: [],
  };

  const user: UserType = await User.create(payload)
    .then((user) => {
      if (!user) {
        throw new Error("Create user returned null");
      }
      return user;
    })
    .catch((error) => {
      throw new Error("Error while creating user: " + error);
    });
  return user;
};

export const generateSampleUsers = async (count: number): UsersPromise => {
  let users: [UserType] = [] as any;

  for (let i = 0; i < count; i++) {
    let payload = {
      userId: `${users.length}-${generateRandomString(8)}`,
      email: `${users.length}-${generateRandomString(4)}@example.com`,
      token: `${users.length}-${generateRandomString(15)}`,
      permissions: [],
    };

    await User.create(payload).then((user: UserType) => {
      users.push(user);
    });
  }

  return new Promise((resolve, reject) => {
    resolve(users);
  });
};
