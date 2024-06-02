import mongoose from 'mongoose'
import { MONGO_URI } from './constants'
import { logger } from 'src/lib'

export const setupDatabase = async (): Promise<void> => {
  await mongoose
    .connect(MONGO_URI, {
      autoIndex: true
    })
    .then(() => {
      logger.info('Connected to MongoDB successfully')
    })
    .catch((err: any) => {
      logger.error('Error connecting to MongoDB: ', err)
    })
}
