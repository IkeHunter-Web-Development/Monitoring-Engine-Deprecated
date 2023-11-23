import { UserType, UserPromise, UsersPromise } from "./user.types";
import UserManager from "../user.manager";
import { generateRandomString } from "../../../utils/utils";

export const generateSampleUser = (data: any = {}): UserPromise => {
  let payload = {
    userId: data.userId || "aasdf8sdf83828",
    email: data.email || "user@example.com",
    token: data.token || "skdlf7asd98f7sk2h3k2jh2klhlhk",
    permissions: data.permissions,
  };

  return UserManager.createUserFromObject(payload);
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

    await UserManager.createUserFromObject(payload).then((user: any) => {
      users.push(user);
    });
  }

  return new Promise((resolve, reject) => {
    resolve(users);
  });
};
