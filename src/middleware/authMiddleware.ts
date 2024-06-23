/**
 * @fileoverview Middleware to manage service level authentication.
 * If unauthenticated, attempt authentication with auth service, if
 * unauthenticated redirect to external login.
 */
import { type NextFunction, type Request, type Response } from 'express'
import { NETWORK_TOKEN, NODE_ENV } from 'src/config'
import { getNetworkAuth, type NetworkAuthResponse } from 'src/network'
import { networkAuthenticationRequired, unauthorized } from 'src/utils'

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
  if (NODE_ENV === 'dev') return next()

  // TODO: Create secure authorization protocol for microservices
  const networkToken = req.headers['x-network-authorization'] as string
  if (networkToken === NETWORK_TOKEN) {
    next()
    return
  }

  const userToken = req.headers?.authorization?.split(' ')[1]

  if (userToken == null) {
    return unauthorized(res, 'User not logged in')
  }

  await getNetworkAuth(userToken)
    .then((networkRes: NetworkAuthResponse) => {
      if (networkRes.status !== 200 || networkRes.userId == null) {
        return networkAuthenticationRequired(res, 'Invalid network token.')
      }

      const locals: AuthLocals = {
        token: userToken,
        projectIds: networkRes.projects ?? []
      }

      res.locals = { ...res.locals, ...locals }

      next()
    })
    .catch((err: Error) => {
      return networkAuthenticationRequired(res, err.message)
    })
}
