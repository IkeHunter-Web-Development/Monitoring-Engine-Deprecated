import 'dotenv/config'

type nodenv = 'development' | 'production' | 'test' | 'network'

export const HOST = process.env.HOST ?? 'localhost'
export const PORT = Number(process.env.PORT) ?? 8000
export const NODE_ENV: nodenv = (process.env.NODE_ENV as nodenv) || 'development'

export const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://root:changeme@mongo-monitor:27017'
export const LOG_LEVEL = process.env.LOG_LEVEL ?? 'debug'
export const LOG_NS = process.env.LOG_NS || 'server'

export const GATEWAY_URL = process.env.GATEWAY_URL ?? 'http://localhost:8080'
export const NETWORK_TOKEN = process.env.NETWORK_TOKEN ?? 'insecure'

// export const KAFKA_HOST = process.env.KAFKA_HOST ?? ''
// export const KAFKA_PORT = process.env.KAFKA_PORT ?? 0
export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092']
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'monitor-engine'
