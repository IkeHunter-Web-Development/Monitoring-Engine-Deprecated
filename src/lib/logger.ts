import { LOG_LEVEL } from 'src/config'
import { addColors, createLogger, format, transports } from 'winston'

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }),
    format.printf((info) => {
      return `[${info.level}] ${info.message}`
    })
  ),
  level: LOG_LEVEL
})

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  debug: 'white'
})

export const logger = createLogger({
  // level: LOG_LEVEL,
  level: 'debug',
  format: format.json(),
  transports: [consoleTransport],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  }
})
