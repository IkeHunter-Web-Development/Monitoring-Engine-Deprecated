/**
 * @fileoverview Tests for monitor api routes.
 */
import request from "supertest";
import server from "../../server";
import Monitor, { monitorSchema } from "../../models/monitor/monitor.model";
import MonitorManager from "../../models/monitor/monitor.manager";
import { forceAuthHeader } from "../../utils/forceAuth";
import { MonitorType } from "src/models/monitor/utils/monitor.types";
import { before } from "lodash";
import Project from "../../models/project/project.model";
import Agency from "../../models/agency/agency.model";
import ProjectManager from "../../models/project/project.manager";

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

beforeEach(async () => {
  await Agency.create(defaultAgency);
  // await Project.create(defaultProject);
  await ProjectManager.createProject(defaultProject);
});

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

    const res = await request(server)
      .post("/monitors")
      .send(defaultMonitor)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res.status).toEqual(201);

    // let monitors = await Monitor.find({});
    let monitors = await MonitorManager.getMonitors();
    expect(monitors.length).toEqual(1);
    expect(monitors[0].project.projectId).toEqual(defaultMonitor.project.projectId);
  });

  /**
   * PUT /monitors/:id should update a monitor
   * and return a 200 status code.
   */
  it("should update a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server)
      .put(`/monitors/${monitor._id}`)
      .send({ title: "Yahoo" })
      .set(forceAuthHeader.name, forceAuthHeader.value);

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

    const res = await request(server)
      .get(`/monitors/${monitor._id}`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res.status).toEqual(200);
    expect(res.body._id).toEqual(monitor._id.toString());
  });

  /**
   * DELETE /monitors/:id should delete a monitor
   * and return a 200 status code.
   */
  it("should delete a monitor", async () => {
    let monitor = await Monitor.create(defaultMonitor);

    const res = await request(server)
      .delete(`/monitors/${monitor._id}`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

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
      project: {
        agency: defaultAgency,
        projectId: "123",
        name: "Test Project",
      },
      // projectId: "123",
    });
    let monitor2 = await Monitor.create({
      ...defaultMonitor,
      project: {
        agency: defaultAgency,
        projectId: "456",
        name: "Test Project 2",
      },
      // projectId: "456",
    });
    let monitor3 = await Monitor.create({
      ...defaultMonitor,
      project: {
        agency: defaultAgency,
        projectId: "789",
        name: "Test Project 3",
      },
      // projectId: "789",
    });

    const res = await request(server)
      .get(`/monitors`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(3);

    let sorted: MonitorType[] = res.body.sort((a: any, b: any) => {
      return a.project.projectId - b.project.projectId;
    });

    expect(sorted[0].project.projectId).toEqual(monitor.project.projectId);
    expect(sorted[1].project.projectId).toEqual(monitor2.project.projectId);
    expect(sorted[2].project.projectId).toEqual(monitor3.project.projectId);
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

    const res = await request(server)
      .get(`/monitors/${monitor._id}/online`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(true);
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

    const res = await request(server)
      .get(`/monitors-search/?projectId=${m1.project.projectId}`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].project.projectId).toEqual(m1.project.projectId);
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

    const res2 = await request(server)
      .get(`/monitors-search/?userId=${m2.users[0].userId}`)
      .set(forceAuthHeader.name, forceAuthHeader.value);

    expect(res2.status).toEqual(200);
    expect(res2.body.length).toEqual(1);
    expect(res2.body[0].project.projectId).toEqual(m2.project.projectId);
  });
});
