import mongoose from 'mongoose'
import { MONGO_CONNECTION_URI } from './constants'

const uri = MONGO_CONNECTION_URI

const connect = async (): Promise<void> => {
  await mongoose.connect(uri)
}

const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

const clearDatabase = async (): Promise<void> => {
  await mongoose.connection.db.dropDatabase()
}

beforeEach(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())
