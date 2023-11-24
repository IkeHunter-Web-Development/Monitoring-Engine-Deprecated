import MonitorManager from "./monitor";
import { generateRandomString } from "../utils/utils";

export const generateSampleMonitor = async (data: any = {}) => {
  let payload = {
    url: data.url || "https://example.com",
    users: data.users || [],
    statusCode: data.statusCode || 200,
    title: data.title || `Monitor ${generateRandomString(4)}`,
    active: data.active || true,
  };

  return await MonitorManager.createMonitor(payload);
};
