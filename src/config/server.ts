import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import responseTime from 'response-time'
import { router } from 'src/router'
import { errorHandler } from '../middleware/errorHandler'

const server = express()

const urlencodedParser = express.urlencoded({ extended: false })
const jsonParser = express.json()

server.use(urlencodedParser)
server.use(jsonParser)
server.use(multer().any())

server.use(responseTime())
server.use(morgan('common', { immediate: true }))
server.use(router)
server.use(errorHandler)

export { server }
