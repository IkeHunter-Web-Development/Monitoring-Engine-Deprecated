import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_ISSUER, JWT_SECRET_KEY } from "src/config";

const config = {
  secret: JWT_SECRET_KEY,
  expiresIn: JWT_EXPIRES_IN,
  issuer: JWT_ISSUER,
  algorithm: JWT_ALGORITHM,
};

export interface TokenPayload extends JwtPayload {
  userId: string;
  originalToken: string;
}

export const verifyToken = (token: string): JwtPayload | string => {
  let jwtPayload = <any>jwt.verify(token?.split(" ")[1], config.secret!, {
    complete: true,
    issuer: config.issuer,
    algorithms: [config.algorithm as any],
    clockTolerance: 0,
    ignoreExpiration: false,
    ignoreNotBefore: false,
  });

  jwtPayload.payload.originalToken = token;
  
  return jwtPayload.payload;
}