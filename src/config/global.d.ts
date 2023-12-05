declare const NODE_ENV: string = process.env.NODE_ENV || "development";
declare const AUTH_SERVICE_URL: string = process.env.AUTH_SERVICE_URL || "http://localhost:8000/api/auth";
declare const HOST: string = process.env.HOST || "localhost";
declare const PORT: number = Number(process.env.PORT) || 8000;
declare const MONGO_URI: string = process.env.MONGO_URI || "";
declare const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY || "";
declare const EMAIL_USER: string = process.env.EMAIL_USER || "";
declare const LOGGING_LEVEL: string = process.env.LOGGING_LEVEL || "info";