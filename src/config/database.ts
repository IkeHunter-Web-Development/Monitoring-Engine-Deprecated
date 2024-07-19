import mongoose from 'mongoose'
import { logger } from 'src/lib'
import { MONGO_URI } from './constants'

export const setupDatabase = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    })
    .then(() => {
      logger.info('Connected to MongoDB successfully')
    })
    .catch((err: any) => {
      console.log(MONGO_URI)
      logger.error('Error connecting to MongoDB: ', err)
    })
}
