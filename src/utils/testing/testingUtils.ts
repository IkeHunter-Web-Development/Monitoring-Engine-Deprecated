import { Response } from "express";

export const getResJson = (res: Response) => {
  return (res as any)._getJSONData();
};