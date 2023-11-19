// import { generateRandomString } from "@src/utils/generator";
import MonitorManager from "../monitor.manager";
import { MonitorType } from "./monitor.types";
import { generateSampleUser } from "../../user/utils/user.util";
// import { generateRandomString } from "src/utils/generator";
import { generateRandomString } from "../../../utils/generator";

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
