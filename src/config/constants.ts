export const NODE_ENV = process.env.NODE_ENV || "development";
export const HOST = process.env.HOST || "localhost";
export const PORT = Number(process.env.PORT) || 8000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://root:changeme@mongo-monitor:27017";
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
export const EMAIL_USER = process.env.EMAIL_USER || "";
export const LOGGING_LEVEL = process.env.LOGGING_LEVEL || "info";
export const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:8080"
