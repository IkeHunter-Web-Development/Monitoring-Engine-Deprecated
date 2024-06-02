import type { NextFunction, Response } from 'express'

export const sendError = (error: any, res: Response, next: NextFunction) => {
  res.status(500)
  return next(error)
}
