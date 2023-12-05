/**
 * @fileoverview Tests for event api routes.
 */
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import { getResJson } from "src/utils";
import { Monitor, Event } from "src/models";
import { EventService, MonitorService } from "src/services";
import { EventController as controller } from "./eventsController";

// const defaultAgency = {
//   agencyId: "456",
//   name: "Test agency",
// };
// const defaultProject = {
//   agency: defaultAgency,
//   projectId: "123",
//   name: "Test Project",
// };

const defaultMonitor = {
  // project: defaultProject,
  projectId: "123",
  url: "https://www.google.com",
  users: [],
  title: "Google",
};

const defaultEvent = {
  monitorId: "123",
  timestamp: Date.now(),
  message: "Monitor is offline",
  statusCode: 500,
  online: false,
};

let m1: Monitor;
let m2: Monitor;
// let m3: Monitor;

let e1: Event;
// let e2: Event;
// let e3: Event;
// let e4: Event;
let e5: Event;
let e6: Event;

describe("Event controller", () => {
  let req: Request;
  let res: Response;

  beforeEach(async () => {
    res = httpMocks.createResponse();

    // await Agency.create(defaultAgency);
    // await Project.create(defaultProject);
    /**
     * Monitor 1: Google
     */
    m1 = await MonitorService.createMonitor(defaultMonitor);
    e1 = await EventService.createEvent({
      ...defaultEvent,
      monitorId: m1._id,
      online: false,
    });

    await EventService.createEvent({
      ...defaultEvent,
      monitorId: m1._id,
      online: true,
      message: "Monitor is online",
    });

    /**
     * Monitor 2: Yahoo
     */
    m2 = await MonitorService.createMonitor({
      ...defaultMonitor,
      projectId: "456",
      url: "https://www.yahoo.com",
      title: "Yahoo",
    });

    await EventService.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: true,
      message: "Monitor is online",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    });

    await EventService.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: false,
      message: "Monitor is offline",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    });

    e5 = await EventService.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: false,
      message: "Monitor is offline",
      timestamp: Date.now(),
    });

    e6 = await EventService.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: true,
      message: "Monitor is online",
      timestamp: Date.now(),
    });
  });

  // afterEach(async () => {
  //   await Monitor.deleteMany({});
  //   await Event.deleteMany({});
  // });

  /**===========*
   * CRUD TESTS *
   *============*/
  /**
   * GET /events/:id should return an event.
   */
  it("should get an event", async () => {
    req = httpMocks.createRequest({
      method: "GET",
      params: { id: e1._id },
    });
    await controller.getEvent(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body._id).toEqual(e1._id.toString());
  });
  /**
   * DELETE /events/:id should delete an event.
   */
  it("should delete an event", async () => {
    req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: e1._id },
    });
    await controller.deleteEvent(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.message).toEqual("Event deleted");
  });

  /**=============*
   * SEARCH TESTS *
   *==============*/
  /**
   * GET /events/search/?monitor=id should get events for a monitor.
   */
  it("should get events for a monitor", async () => {
    req = httpMocks.createRequest({
      method: "GET",
      query: { monitor: m1._id },
    });
    await controller.searchEvents(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(2);
    expect(body[0]._id).toEqual(e1._id.toString());
  });
  /**
   * GET /events/search/?monitor=id&online=false should get offline events for a monitor.
   */
  it("should get offline events for a monitor", async () => {
    req = httpMocks.createRequest({
      method: "GET",
      query: {
        monitor: m1._id,
        online: false,
      },
    });
    await controller.searchEvents(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body.length).toEqual(1);
    expect(body[0]._id).toEqual(e1._id.toString());
  });
  /**
   * GET /events/search/?monitor=id&online=false&last=true should get the
   * last time a monitor was offline.
   */
  it("should get the last time a monitor was offline", async () => {
    req = httpMocks.createRequest({
      method: "GET",
      query: {
        monitor: m2._id,
        online: false,
        last: true,
      },
    });
    await controller.searchEvents(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body[0]._id).toEqual(e5._id.toString());
  });
  /**
   * GET /events/search/?monitor=id&online=true&last=true should get the
   * last time a monitor was online.
   */
  it("should get the last time a monitor was online", async () => {
    req = httpMocks.createRequest({
      method: "GET",
      query: {
        monitor: m2._id,
        online: true,
        last: true,
      },
    });
    await controller.searchEvents(req, res);
    const body = getResJson(res);

    expect(res.statusCode).toEqual(200);
    expect(body[0]._id).toEqual(e6._id.toString());
  });
});
