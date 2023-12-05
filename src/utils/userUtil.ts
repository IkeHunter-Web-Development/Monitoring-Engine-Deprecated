import { User } from "src/models";
import { generateRandomString } from "src/utils";


export const generateSampleUser = async (data: any = {}): Promise<User> => {
  let payload = {
    userId: data.userId || "aasdf8sdf83828",
    email: data.email || "user@example.com",
    token: data.token || "skdlf7asd98f7sk2h3k2jh2klhlhk",
    projectIds: [],
  };

  const user: User = await User.create(payload)
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

export const generateSampleUsers = async (count: number): Promise<User[]> => {
  let users: [User] = [] as any;

  for (let i = 0; i < count; i++) {
    let payload = {
      userId: `${users.length}-${generateRandomString(8)}`,
      email: `${users.length}-${generateRandomString(4)}@example.com`,
      token: `${users.length}-${generateRandomString(15)}`,
      permissions: [],
    };

    await User.create(payload).then((user: User) => {
      users.push(user);
    });
  }

  return new Promise((resolve) => {
    resolve(users);
  });
};
