import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import { logger } from 'src/lib'
import { router } from 'src/router'
import { errorHandler } from '../middleware/errorHandler'

const server = express()

const urlencodedParser = express.urlencoded({ extended: false })
const jsonParser = express.json()

server.use(urlencodedParser)
server.use(jsonParser)
server.use(multer().any())

server.use(
  morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
    immediate: true,
    stream: { write: (message) => logger.http(message) }
  })
)
server.use(router)
server.use(errorHandler)

export { server }
