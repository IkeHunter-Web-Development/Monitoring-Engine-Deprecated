/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */
import { type NextFunction, type Request, type Response } from 'express'
import { NETWORK_TOKEN, NODE_ENV } from 'src/config'
import { Network, type NetworkAuthResponse } from 'src/data/network'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  /** ====================*
    @swagger Authenticate with network.
    #swagger.security = [{
        "bearerAuth": []
    }]
   *===================== */
  if (NODE_ENV === 'development') { next(); return }

  // TODO: Create secure authorization protocol for microservices
  const networkToken = req.headers['x-network-authorization'] as string
  if (networkToken === NETWORK_TOKEN) { next(); return }

  const userToken = req.headers?.authorization?.split(' ')[1]

  if (userToken == null) {
    res.status(401).json({
      status: 401,
      message: 'User not logged in'
    })
    return
  }

  // const networkRes: NetworkAuthResponse = await Network.authenticate(userToken)
  Network.authenticate(userToken).then((networkRes: NetworkAuthResponse) => {
    if (networkRes.status !== 200 || networkRes.userId == null) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid network token'
      })
    }

    res.locals = { ...res.locals, token: userToken }

    next()
  }).catch((err: Error) => {
    console.error(err)
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    })
  })
}
