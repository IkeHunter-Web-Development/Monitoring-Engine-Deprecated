import dotenv from 'dotenv'
import 'dotenv/config'

type nodenv = 'dev' | 'production' | 'test' | 'network'

export const HOST = process.env.HOST ?? 'localhost'
export const PORT = Number(process.env.PORT) ?? 8000
export const NODE_ENV: nodenv = (process.env.NODE_ENV as nodenv) || 'production'

if (NODE_ENV === 'test') {
  dotenv.config()
  process.env.LOG_LEVEL = 'warn'
}

// export const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://root:changeme@mongo-monitor:27017'
const MONGO_USER = process.env.MONGO_USER || 'root'
const MONGO_PASS = process.env.MONGO_PASS || 'changeme'
const MONGO_PROTOCOL = process.env.MONGO_PROTOCOL || 'mongodb'
const MONGO_URI = process.env.MONGO_URI || 'mongo-monitor:27017'

export const MONGO_CONNECTION_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_URI}`
export const LOG_LEVEL = process.env.LOG_LEVEL || 'warn'
export const LOG_NS = process.env.LOG_NS || 'server'

export const GATEWAY_URL = process.env.GATEWAY_URL ?? 'http://localhost:8080'
export const NETWORK_TOKEN = process.env.NETWORK_TOKEN ?? 'insecure'

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'monitor-engine'
