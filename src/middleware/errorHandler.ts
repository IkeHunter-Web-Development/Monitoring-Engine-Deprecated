import type { NextFunction, Request, Response } from 'express'
import { logger } from 'src/lib'
import { MonitorNotFoundError, NotImplementedError, Responses } from 'src/utils'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.stack || 'Unknown API Error.')
  // logger.error(error.stack)
  // console.log('API Error:', error.stack)

  if (error instanceof MonitorNotFoundError) {
    return next(Responses.notFound(res, error))
  } else if (error instanceof NotImplementedError) {
    return next(Responses.notImplemented(res, error))
  } else {
    return next(Responses.badRequest(res, error))
  }
}

// export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
//   // console.error(error.stack)

//   try {
//     next()
//   } catch (error) {
//     if (error instanceof MonitorNotFoundError) {
//       return next(Responses.notFound(res, error))
//     } else if (error instanceof NotImplementedError) {
//       return next(Responses.notImplemented(res, error))
//     } else {
//       return next(Responses.badRequest(res, error))
//     }
//   }
// }
