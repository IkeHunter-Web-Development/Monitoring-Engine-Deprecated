/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */
import { type NextFunction, type Request, type Response } from 'express'
import { NETWORK_TOKEN, NODE_ENV } from 'src/config'
import { Network, type NetworkAuthResponse } from 'src/data/network'
import { Responses } from 'src/utils'

export type AuthLocals = {
  token: string
  projectIds: string[]
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  /** ====================*
    @swagger Authenticate with network.
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[401] = {
      schema: {$ref: "#/definitions/Error401"},
      description: "Unauthorized"
    }
    #swagger.responses[511] = {
      schema: {$ref: "#/definitions/Error511"},
      description: "Network authentication required"
    }
   *===================== */
  if (NODE_ENV === 'development') return next()

  // TODO: Create secure authorization protocol for microservices
  const networkToken = req.headers['x-network-authorization'] as string
  if (networkToken === NETWORK_TOKEN) {
    next()
    return
  }

  const userToken = req.headers?.authorization?.split(' ')[1]

  if (userToken == null) {
    return Responses.unauthorized(res, 'User not logged in')
    // res.status(401).json({
    //   status: 401,
    //   message: 'User not logged in'
    // })
    // return
  }

  await Network.authenticate(userToken)
    .then((networkRes: NetworkAuthResponse) => {
      if (networkRes.status !== 200 || networkRes.userId == null) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid network token'
        })
      }

      const locals: AuthLocals = {
        token: userToken,
        projectIds: networkRes.projects ?? []
      }

      res.locals = { ...res.locals, ...locals }

      next()
    })
    .catch((err: Error) => {
      return Responses.networkAuthenticationRequired(res, err.message)
    })
}
