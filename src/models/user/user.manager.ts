/**
 * @fileoverview Manager for the user model.
 */
import User from "./user.model";
import { UserPromise } from "./utils/user.types";

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
  public static async createUser(userId: string, email: string, data: any = {}): UserPromise {
    if (!userId) throw new Error("No userId provided");
    if (!email) throw new Error("No email provided");

    let payload = this.instance.parseData({
      ...data,
      userId: userId,
      email: email,
    });

    let user = User.create(payload)
      .then((user: any) => {
        return user;
      })
      .catch((err: any) => {
        throw err;
      });

    return user;
  }

  public static async createUserFromObject(data: any): UserPromise {
    let payload = this.instance.parseData(data);

    let user = User.create(payload)
      .then((user: any) => {
        return user;
      })
      .catch((err: any) => {
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
  public static async getUserById(userId: string): UserPromise {
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
  static async getUserByToken(token: string): UserPromise {
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
  static async updateUser(userId: string, data: any): UserPromise {
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
  public static async createOrUpdateUser(userId: string, data: any): UserPromise {
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
  public static async deleteUser(userId: string): UserPromise {
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
  public static async getRandomUser(): Promise<any> {
    let users = await User.find({}).catch((err) => {
      console.log("Error getting users: ", err);
      return [];
    });

    if (users.length === 0) return undefined;

    let max = users.length - 1;
    let min = 0;
    let index = Math.floor(Math.random() * (max - min + 1) + min);

    return users[index];
  }
}
