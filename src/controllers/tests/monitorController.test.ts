/**
 * @fileoverview Tests for monitor api routes.
 */
import Monitor from "../../models/monitor/model";
import MonitorManager from "../../services/monitor";
import { MonitorType } from "../../models/monitor/monitor.types";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import * as controller from "./controller";
import { getResJson } from "../../utils/utils";

const defaultMonitor = {
  projectId: "123abc",
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
  let req: Request;
  let res: Response;

  beforeEach(async () => {
    res = httpMocks.createResponse();
  });
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

    req = httpMocks.createRequest({
      method: "POST",
      body: defaultMonitor,
    });

    await controller.createMonitor(req, res);
    expect(res.statusCode).toEqual(201);

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

    req = httpMocks.createRequest({
      method: "PUT",
      body: { title: "Yahoo" },
      params: { id: monitor._id },
    });

    await controller.updateMonitor(req, res as Response);
    expect(res.statusCode).toEqual(200);

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

    req = httpMocks.createRequest({
      params: { id: monitor._id },
    });
    await controller.getMonitor(req, res);
    expect(res.statusCode).toEqual(200);

    // const body = (res as any)._getJSONData();
    const body = getResJson(res);
    expect(body._id).toEqual(monitor._id.toString());
  });

  /**
   * DELETE /monitors/:id should delete a monitor
   * and return a 200 status code.
   */
  it("should delete a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: monitor._id },
    });
    await controller.deleteMonitor(req, res);

    expect(res.statusCode).toEqual(200);

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

    const req = httpMocks.createRequest({
      method: "GET",
    });
    await controller.getMonitors(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(3);

    let sorted: MonitorType[] = body.sort((a: any, b: any) => {
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

    const req = httpMocks.createRequest({
      method: "GET",
      params: monitor._id,
    });
    await controller.getMonitorOnlineStatus(req, res);
    const body = (res as any)._getData();

    expect(res.statusCode).toEqual(200);
    expect(body).toEqual("true");
  });

  /**
   * GET /monitors/search/?project=id should return monitors
   * that belong to a project.
   */
  it("should return monitors for project", async () => {
    let m1 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      users: [u1, u2],
    });
    let m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      projectId: "456",
      users: [u3, u4],
    });

    req = httpMocks.createRequest({
      method: "GET",
      query: { projectId: m1.projectId },
    });
    await controller.searchMonitors(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(1);
    expect(body[0].projectId).toEqual(m1.projectId);
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

    req = httpMocks.createRequest({
      method: "GET",
      query: { userId: m2.users[0].userId },
    });
    await controller.searchMonitors(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(1);
    expect(body[0].projectId).toEqual(m2.projectId);
  });
});
