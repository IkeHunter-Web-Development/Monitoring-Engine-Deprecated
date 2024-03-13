import type { NextFunction, Response } from 'express'

export const sendError = (error: any, res: Response, next: NextFunction) => {
  console.log('Error from view:', error)

  res.status(500)
  return next(error)
}
