/**
 * @fileoverview Tests for monitor api routes.
 */
import request from "supertest";
import server from "../../server";
import Monitor, { monitorSchema } from "../../models/monitor/monitor.model";
import MonitorManager from "../../models/monitor/monitor.manager";

const defaultMonitor = {
  projectId: "123",
  companyId: "456",
  url: "https://www.google.com",
  users: [],
  title: "Google",
};
const u1 = {
  userId: "123",
  email: "u1@example.com",
};
const u2 = {
  userId: "456",
  email: "u2@example.com",
};
const u3 = {
  userId: "789",
  email: "u3@example.com",
};
const u4 = {
  userId: "012",
  email: "u4@example.com",
};

describe("Monitor controller", () => {
  /**==========
   * CRUD TESTS
   ============*/

  /**
   * POST /monitors/:id should create a monitor
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
   * PUT /monitors/:id should update a monitor
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
   * GET /monitors/:id should return a monitor
   * and return a 200 status code.
   */
  it("should get a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server).get(`/monitors/${monitor._id}`);

    expect(res.status).toEqual(200);
    expect(res.body._id).toEqual(monitor._id.toString());
  });

  /**
   * DELETE /monitors/:id should delete a monitor
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
   * GET /monitors should return all monitors
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
  /**
   * GET /monitors/:id/online should return true
   * if the site is online
   */
  it("should return true if the site is online", async () => {
    let monitor = await MonitorManager.createMonitor({
      ...defaultMonitor,
      online: true,
    });

    const res = await request(server).get(`/monitors/${monitor._id}/online`);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(true);
  });

  /**
   * GET /monitors/search/?project=id should return monitors
   * that belong to a project.
   */
  it("should return monitors", async () => {
    let m1 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      users: [u1, u2],
    });
    let m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      projectId: "456",
      users: [u3, u4],
    });

    const res = await request(server).get(`/monitors-search/?projectId=${m1.projectId}`);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].projectId).toEqual(m1.projectId);
  });
  /**
   * GET /monitors/search/?user=id should return monitors
   * that a user is subscribed to.
   */
  it("should return monitors that a user is subscribed to", async () => {
    let m1 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      users: [u1, u2],
    });
    let m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      projectId: "456",
      users: [u3, u4],
    });

    const res2 = await request(server).get(`/monitors-search/?userId=${m2.users[0].userId}`);

    expect(res2.status).toEqual(200);
    expect(res2.body.length).toEqual(1);
    expect(res2.body[0].projectId).toEqual(m2.projectId);
  });
});
