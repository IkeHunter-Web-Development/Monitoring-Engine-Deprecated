// import { generateRandomString } from "@src/utils/generator";
import MonitorManager from "./monitor";
import { MonitorType } from "./models/types";
import { generateSampleUser } from "../core/models/user/utils/user.util";
// import { generateRandomString } from "src/utils/generator";
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
