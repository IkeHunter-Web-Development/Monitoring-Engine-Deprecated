import mongoose from 'mongoose'
import 'dotenv/config'
import { MONGO_URI } from './constants'

const uri = MONGO_URI ?? 'mongodb://root:changeme@mongo-monitor:27017'

const connect = async (): Promise<void> => {
  await mongoose.connect(uri)
}

const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

const clearDatabase = async (): Promise<void> => {
  await mongoose.connection.db.dropDatabase()
  // const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   const collection = collections[key];
  //   await collection.deleteMany({});
  // }
}

beforeEach(async () => { await connect() })
afterEach(async () => { await clearDatabase() })
afterAll(async () => { await closeDatabase() })
