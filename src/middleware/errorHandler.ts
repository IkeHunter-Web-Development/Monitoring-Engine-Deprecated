import type { NextFunction, Request, Response } from 'express'
import { logger } from 'src/lib'
import {
  MonitorNotFoundError,
  NotImplementedError,
  badRequest,
  notFound,
  notImplemented
} from 'src/utils'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.stack || 'Unknown API Error.')

  if (error instanceof MonitorNotFoundError) {
    return next(notFound(res, error))
  } else if (error instanceof NotImplementedError) {
    return next(notImplemented(res, error))
  } else {
    return next(badRequest(res, error))
  }
}
