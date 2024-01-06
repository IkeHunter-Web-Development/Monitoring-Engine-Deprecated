/**
 * @fileoverview General routes for the API.
 * 
 * Additional resources:
 * - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * - https://enterprisecraftsmanship.com/posts/rest-api-response-codes-400-vs-500/
 */

import { Response } from "express";

export abstract class BaseController {
  private static formatResponse = (status: number, message: string) => {
    return {
      status,
      message
    };
  }
  /**
   * @response 200 - OK
   * The request succeeded.
   */
  protected static ok = async (res: Response, data?: any) => {
    const payload = this.formatResponse(200, "OK");
    
    return res.status(200).json(data || payload);
  }
  
  /**
   * @response 201 - Created
   * The request has been fulfilled, resulting in the creation of a new resource.
   */
  protected static created = async (res: Response, data?: any) => {
    const payload = this.formatResponse(201, "Created");
    
    return res.status(201).json(data || payload);
  }
  
  /**
   * @response 204 - No Content
   * The server successfully processed the request and is not returning any content.
   */
  protected static noContent = async (res: Response) => {
    return res.status(204).send();
  }
  
  /**
   * @response 400 - Bad Request
   * The server cannot or will not process the request due to an apparent client error.
   * Unlike 500 errors which the user can’t do anything about, 400 errors are their fault.
   */
  protected static badRequest = async (res: Response, message?: string) => {
    const payload = this.formatResponse(400, message || "Bad Request");
    
    return res.status(400).json(payload);
  }
  
  /**
   * @response 401 - Unauthorized
   * The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  protected static unauthorized = async (res: Response, message?: string) => {
    const payload = this.formatResponse(401, message || "Unauthorized");
    
    return res.status(401).json(payload);
  }
  
  /**
   * @response 403 - Forbidden
   * The server understood the request but refuses to authorize it.
   * Unlike 401 Unauthorized, the client's identity is known to the server.
   */
  protected static forbidden = async (res: Response, message?: string) => {
    const payload = this.formatResponse(403, message || "Forbidden");
    
    return res.status(403).json(payload);
  }
  
  /**
   * @response 404 - Not Found
   * The requested resource could not be found but may be available in the future.
   * Subsequent requests by the client are permissible.
   */
  protected static notFound = async (res: Response, message?: string) => {
    const payload = this.formatResponse(404, message || "Not Found");
    
    return res.status(404).json(payload);
  }
  
  /**
   * @response 405 - Method Not Allowed
   * The request method is known by the server but is not supported by the target resource.
   */
  protected static methodNotAllowed = async (res: Response, message?: string) => {
    const payload = this.formatResponse(405, message || "Method Not Allowed");
    
    return res.status(405).json(payload);
  }
  
  /**
   * @response 409 - Conflict
   * This response is sent when a request conflicts with the current state of the server.
   */
  protected static conflict = async (res: Response, message?: string) => {
    const payload = this.formatResponse(409, message || "Conflict");
    
    return res.status(409).json(payload);
  }
  
  /**
   * @response 410 - Gone
   * This response is sent when the requested content has been permanently deleted from server,
   * clients are expected to remove their caches and links to the resource. The HTTP specification 
   * intends this status code to be used for "limited-time, promotional services".
   */
  protected static gone = async (res: Response, message?: string) => {
    const payload = this.formatResponse(410, message || "Gone");
    
    return res.status(410).json(payload);
  }
  
  /**
   * @response 500 - Internal Server Error
   * The server has encountered a situation it does not know how to handle.
   * Never return 500 errors intentionally. The only way your service should 
   * respond with a 500 code is by processing an unhandled exception.
   */
  protected static internalServerError = async (res: Response, message?: string) => {
    const payload = this.formatResponse(500, message || "Internal Server Error");
    
    return res.status(500).json(payload);
  }
  
  /**
   * @response 501 - Not Implemented
   * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   * The only methods that servers are required to support (and therefore that must 
   * not return this code) are GET and HEAD.
   */
  protected static notImplemented = async (res: Response, message?: string) => {
    const payload = this.formatResponse(501, message || "Not Implemented");
    
    return res.status(501).json(payload);
  }
  
  /**
   * @response 502 - Bad Gateway
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  protected static badGateway = async (res: Response, message?: string) => {
    const payload = this.formatResponse(502, message || "Bad Gateway");
    
    return res.status(502).json(payload);
  }
  
  /**
   * @response 503 - Service Unavailable
   * The server cannot handle the request (because it is overloaded or down for maintenance).
   */
  protected static serviceUnavailable = async (res: Response, message?: string) => {
    const payload = this.formatResponse(503, message || "Service Unavailable");
    
    return res.status(503).json(payload);
  }
  
  /**
   * @response 504 - Gateway Timeout
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  protected static gatewayTimeout = async (res: Response, message?: string) => {
    const payload = this.formatResponse(504, message || "Gateway Timeout");
    
    return res.status(504).json(payload);
  }
  
  /**
   * @response 511 - Network Authentication Required
   * The client needs to authenticate to gain network access.
   */
  protected static networkAuthenticationRequired = async (res: Response, message?: string) => {
    const payload = this.formatResponse(511, message || "Network Authentication Required");
    
    return res.status(511).json(payload);
  }
}
