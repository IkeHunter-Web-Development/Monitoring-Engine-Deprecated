/**
 * @fileoverview Tests for monitor api routes.
 */
import Monitor from "../../models/monitor/monitor.model";
import MonitorManager from "../../models/monitor/monitor.manager";
import { MonitorType } from "src/models/monitor/utils/monitor.types";
import Project from "../../models/project/project.model";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import * as controller from "../monitor.controller";
import Agency from "../../models/agency/agency.model";

const defaultAgency = {
  agencyId: "456",
  name: "Test agency",
};
const defaultProject = {
  agency: defaultAgency,
  projectId: "123",
  name: "Test Project",
};

const defaultMonitor = {
  project: defaultProject,
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

const getJson = (res: Response) => {
  return (res as any)._getJSONData();
};

describe("Monitor controller", () => {
  let req: Request;
  let res: Response;

  beforeEach(async () => {
    await Agency.create(defaultAgency);
    await Project.create(defaultProject);
    
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
    expect(monitors[0].project?.projectId).toEqual(defaultMonitor.project.projectId);
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
    const body = getJson(res);
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
      project: {
        agency: defaultAgency,
        projectId: "123",
        name: "Test Project",
      },
    });
    let monitor2 = await Monitor.create({
      ...defaultMonitor,
      project: {
        agency: defaultAgency,
        projectId: "456",
        name: "Test Project 2",
      },
    });
    let monitor3 = await Monitor.create({
      ...defaultMonitor,
      project: {
        agency: defaultAgency,
        projectId: "789",
        name: "Test Project 3",
      },
    });

    const req = httpMocks.createRequest({
      method: "GET",
    });
    await controller.getMonitors(req, res);
    const body = getJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(3);

    let sorted: MonitorType[] = body.sort((a: any, b: any) => {
      return a.project.projectId - b.project.projectId;
    });

    expect(sorted[0].project.projectId).toEqual(monitor.project?.projectId);
    expect(sorted[1].project.projectId).toEqual(monitor2.project?.projectId);
    expect(sorted[2].project.projectId).toEqual(monitor3.project?.projectId);
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
    const p2 = {
      agency: defaultAgency,
      projectId: "456",
      name: "Test Project 2",
    };
    await Project.create(p2);

    let m1 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      users: [u1, u2],
    });
    let m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      project: p2,
      users: [u3, u4],
    });

    req = httpMocks.createRequest({
      method: "GET",
      query: { projectId: m1.project.projectId },
    });
    await controller.searchMonitors(req, res);
    const body = getJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(1);
    expect(body[0].project.projectId).toEqual(m1.project.projectId);
  });
  /**
   * GET /monitors/search/?user=id should return monitors
   * that a user is subscribed to.
   */
  it("should return monitors that a user is subscribed to", async () => {
    const p2 = {
      agency: defaultAgency,
      projectId: "456",
      name: "Test Project 2",
    };
    await Project.create(p2);

    let m1 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      users: [u1, u2],
    });
    let m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      // projectId: "456",
      project: p2,
      users: [u3, u4],
    });
    
    req = httpMocks.createRequest({
      method: "GET",
      query: { userId: m2.users[0].userId },
    });
    await controller.searchMonitors(req, res);
    const body = getJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(1);
    expect(body[0].project.projectId).toEqual(m2.project.projectId);
  });
});
