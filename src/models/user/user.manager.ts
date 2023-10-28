/**
 * @fileoverview Manager for the user model.
 */
import User from "./user.model";

export default class UserManager {
  private static instance: UserManager = new UserManager();

  /**
   * Parse data to create a user.
   *
   * @param data The data to parse.
   * @returns The parsed data.
   */
  private parseData(data: any) {
    let payload = {
      userId: data.userId || "",
      email: data.email || "",
      token: data.token || "",
    };

    return payload;
  }

  /**
   * Create a user.
   *
   * @param userId The id of the user.
   * @param email The email of the user.
   * @param data, Additional data to create the user with.
   * @returns The created user.
   * @throws Error if userId or email is not provided.
   * @throws Error if the user is not found.
   */
  static async createUser(userId: string, email: string, data: any = {}): Promise<typeof User> {
    if (!userId) throw new Error("No userId provided");
    if (!email) throw new Error("No email provided");

    let payload = this.instance.parseData({
      ...data,
      userId: userId,
      email: email,
    });

    let user = User.create(payload)
      .then((user: any) => {
        console.log("User created: ", user);
        return user;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return user;
  }

  /**
   * Get a user by id.
   *
   * @param userId The id of the user.
   * @returns The user.
   * @throws Error if the user is not found.
   */
  static async getUserById(userId: string): Promise<typeof User> {
    let user = User.findOne({ userId: userId })
      .then((user: any) => {
        if (!user) return null;

        return user;
      })
      .catch((err: any) => {
        throw err;
      });

    return user;
  }

  /**
   * Get user by token.
   *
   * @param token The token of the user.
   * @returns The user.
   * @throws Error if the user is not found.
   */
  static async getUserByToken(token: string): Promise<typeof User> {
    let user = User.findOne({ token: token })
      .then((user: any) => {
        if (!user) return null;

        return user;
      })
      .catch((err: any) => {
        throw err;
      });

    return user;
  }

  /**
   * Update a user.
   *
   * @param userId The id of the user to update.
   * @param data The data to update the user with.
   * @returns The updated user.
   * @throws Error if the user is not found.
   */
  static async updateUser(userId: string, data: any): Promise<typeof User> {
    let payload = this.instance.parseData(data);

    let update = User.findOneAndUpdate({ userId: userId }, payload, { new: true })
      .then((user: any) => {
        if (!user) throw new Error("User not found");

        return user;
      })
      .catch((err: any) => {
        throw err;
      });

    return update;
  }

  /**
   * Create or update a user.
   *
   * @param userId The id of the user to create or update.
   * @param data The data to create or update the user with.
   * @returns The created or updated user.
   */
  static async createOrUpdateUser(userId: string, data: any): Promise<typeof User> {
    let user = await this.getUserById(userId).catch(async (err: any) => {
      try {
        return await this.createUser(userId, data.email, data);
      } catch (e) {
        throw e;
      }
    });

    return user;
  }

  /**
   * Delete a user.
   *
   * @param userId The id of the user to delete.
   * @returns The deleted user.
   * @throws Error if the user is not found.
   */
  static async deleteUser(userId: string): Promise<typeof User> {
    let user = User.findOneAndDelete({ userId: userId })
      .then((user: any) => {
        if (!user) throw new Error("User not found");

        return user;
      })
      .catch((err: any) => {
        throw err;
      });

    return user;
  }

  /**
   * @security UNIT TESTING ONLY
   * Returns a random user to simulate query.
   *
   * @returns Random User.
   */
  static async getRandomUser(): Promise<any> {
    let users = await User.find({}).then((users) => {
      console.log("all users in manager: ", users)
      return users;
    }).catch((err) => {
      console.log("Error getting users: ", err);
      return [];
    });
    console.log("Users: ", users)

    // if (users.length === 0) return undefined;

    // let max = users.length - 1;
    // let min = 0;
    // let index = Math.floor(Math.random() * (max - min + 1) + min);

    // return users[index];
    return users[0];
  }
}
