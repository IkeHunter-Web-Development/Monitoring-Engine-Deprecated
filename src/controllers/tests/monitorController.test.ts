/**
 * @fileoverview Tests for monitor api routes.
 */
import request from "supertest";
import server from "../../server";
import Monitor, { monitorSchema } from "../../models/monitor.model";
import MonitorManager from "../../models/monitor.manager";

const defaultMonitor = {
  projectId: "123",
  url: "https://www.google.com",
  users: [],
  title: "Google",
};

describe("Monitor controller", () => {
  /**==========
   * CRUD TESTS
   ============*/

  /**
   * Create monitor route should create a monitor
   * and return a 201 status code.
   */
  it("should create a monitor", async () => {
    let pre = await MonitorManager.getMonitors();
    expect(pre.length).toEqual(0); // Ensure there are no monitors before the test.
    
    const res = await request(server).post("/monitors").send(defaultMonitor);

    expect(res.status).toEqual(201);

    // let monitors = await Monitor.find({});
    let monitors = await MonitorManager.getMonitors();
    expect(monitors.length).toEqual(1);
    expect(monitors[0].projectId).toEqual(defaultMonitor.projectId);
  });

  /**
   * Update monitor route should update a monitor
   * and return a 200 status code.
   */
  it("should update a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server).put(`/monitors/${monitor._id}`).send({ title: "Yahoo" });

    expect(res.status).toEqual(200);

    let query = await Monitor.findOne({ _id: monitor._id });
    expect(query).not.toBeNull();
    expect(query!.title).toEqual("Yahoo");
  });

  /**
   * Get monitor route should return a monitor
   * and return a 200 status code.
   */
  it("should get a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server).get(`/monitors/${monitor._id}`);

    expect(res.status).toEqual(200);
    expect(res.body._id).toEqual(monitor._id.toString());
  });

  /**
   * Delete monitor route should delete a monitor
   * and return a 200 status code.
   */
  it("should delete a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server).delete(`/monitors/${monitor._id}`);

    expect(res.status).toEqual(200);

    let query = await Monitor.findOne({ _id: monitor._id });
    expect(query).toBeNull();
  });

  /**
   * Get all monitors route should return all monitors
   * and return a 200 status code.
   */
  it("should get all monitors", async () => {
    let monitor = await Monitor.create({
      ...defaultMonitor,
      projectId: "123",
    });
    let monitor2 = await Monitor.create({
      ...defaultMonitor,
      projectId: "456",
    });
    let monitor3 = await Monitor.create({
      ...defaultMonitor,
      projectId: "789",
    });

    const res = await request(server).get(`/monitors`);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(3);
    
    let sorted = res.body.sort((a: any, b: any) => {
      return a.projectId - b.projectId;
    });
    
    expect(sorted[0].projectId).toEqual(monitor.projectId);
    expect(sorted[1].projectId).toEqual(monitor2.projectId);
    expect(sorted[2].projectId).toEqual(monitor3.projectId);
  });
  
  /**=================
   * MANAGEMENT ROUTES
   ===================*/
   
   // TODO: Add user to monitor
   
   // TODO: Remove user from monitor
   
   // TODO: Check if site is online
   
   // TODO: set retries
   
   // TODO: set timeout
   
});
