import { Monitor } from "src/models";

export const sampleMonitor = {
  projectId: "abc",
  url: "https://example.com",
  users: [],
  statusCode: 200,
  active: true,
  title: "Example Live",
  online: true,
  type: "http",
  interval: 60,
  timeout: 1000,
  retries: 3,
};
export const generateMonitor = async (): Promise<Monitor> => {
  return await Monitor.create(sampleMonitor);
}
export const generateMonitors = async (count: number = 1): Promise<Monitor[]> => {
  const monitors = [];
  for (let i = 0; i < count; i++) {
    const monitor: Monitor = await Monitor.create(sampleMonitor);
    monitors.push(monitor);
  }
  return monitors;
};
