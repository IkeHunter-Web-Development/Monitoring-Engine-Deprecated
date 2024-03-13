import 'dotenv/config'
import mongoose from 'mongoose'
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

  // const db = mongoose.connection.db

  // // Get all collections
  // const collections = await db.listCollections().toArray()

  // // Create an array of collection names and drop each collection
  // collections
  //   .map((collection) => collection.name)
  //   .forEach(async (collectionName) => {
  //     db.dropCollection(collectionName)
  //   })
}

beforeEach(async () => {
  await connect()
})
afterEach(async () => {
  await clearDatabase()
})
afterAll(async () => {
  await closeDatabase()
})
