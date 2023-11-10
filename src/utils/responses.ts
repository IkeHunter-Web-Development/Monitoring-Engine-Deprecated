import { Response } from "express";

export const simpleResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};
