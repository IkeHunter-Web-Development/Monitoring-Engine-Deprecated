import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import 'dotenv/config';

// const MONGO_URI = "mongodb://localhost:27017";
const MONGO_URI = `${process.env.MONGO_URI}:${process.env.MONGO_PORT}`

// const mongod = MongoMemoryServer.create({
//   binary: {
//     version: "6.0.7"
//   }
// });

// const mongod = MongoMemoryServer.create();

export const connect = async () => {
  // mongod.then(async (mongod) => {
  //   const uri = mongod.getUri();
  //   await mongoose.connect(uri);
  // });
  await mongoose.connect(MONGO_URI || "");
  // await clearDatabase();
};

export const closeDatabase = async () => {
  // mongod.then(async (mongod) => {
  //   await mongoose.connection.dropDatabase();
  //   await mongoose.connection.close();
  //   await mongod.stop();
  // });
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  // await mongoose.connection.close();
};

beforeEach(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());
