/**
 * @fileoverview Tests for event api routes.
 */
import request from "supertest";
import server from "../../server";
import Monitor, { MonitorType } from "../../models/monitor/monitor.model";
import Event, { EventType } from "../../models/event/event.model";
import MonitorManager from "../../models/monitor/monitor.manager";
import EventManager from "../../models/event/event.manager";

const defaultMonitor = {
  projectId: "123",
  companyId: "456",
  url: "https://www.google.com",
  users: [],
  title: "Google",
};

const defaultEvent = {
  // monitorId: "123",
  timestamp: Date.now(),
  message: "Monitor is offline",
  statusCode: 500,
  online: false,
};

let m1: MonitorType;
let m2: MonitorType;
let m3: MonitorType;

let e1: EventType;
let e2: EventType;
let e3: EventType;
let e4: EventType;
let e5: EventType;
let e6: EventType;

describe("Event controller", () => {
  beforeEach(async () => {
    /**
     * Monitor 1: Google
     */
    m1 = await MonitorManager.createMonitor(defaultMonitor);
    e1 = await EventManager.createEvent({
      ...defaultEvent,
      monitorId: m1._id,
      online: false,
    });

    e4 = await EventManager.createEvent({
      ...defaultEvent,
      monitorId: m1._id,
      online: true,
      message: "Monitor is online",
    });

    /**
     * Monitor 2: Yahoo
     */
    m2 = await MonitorManager.createMonitor({
      ...defaultMonitor,
      projectId: "456",
      url: "https://www.yahoo.com",
      title: "Yahoo",
    });

    e2 = await EventManager.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: true,
      message: "Monitor is online",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    });

    e3 = await EventManager.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: false,
      message: "Monitor is offline",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    });

    e5 = await EventManager.createEvent({
      ...defaultEvent,
      monitorId: m2._id,
      online: false,
      message: "Monitor is offline",
      timestamp: Date.now(),
    });

    e6 = await EventManager.createEvent({
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
    const res = await request(server).get(`/events/${e1._id}`);

    expect(res.status).toEqual(200);
    expect(res.body._id).toEqual(e1._id.toString());
  });
  /**
   * DELETE /events/:id should delete an event.
   */
  it("should delete an event", async () => {
    const res = await request(server).delete(`/events/${e1._id}`);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Event deleted");
  });

  /**=============*
   * SEARCH TESTS *
   *==============*/
  // TODO: get events for monitor
  /**
   * GET /events/search/?monitor=id should get events for a monitor.
   */
  it("should get events for a monitor", async () => {
    const res = await request(server).get(`/events-search/?monitor=${m1._id}`);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]._id).toEqual(e1._id.toString());
  });
  // TODO: get offline events for monitor
  /**
   * GET /events/search/?monitor=id&online=false should get offline events for a monitor.
   */
  it("should get offline events for a monitor", async () => {
    const res = await request(server).get(`/events-search/?monitor=${m1._id}&online=false`);

    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]._id).toEqual(e1._id.toString());
  });
  // TODO: get last time monitor was offline
  /**
   * GET /events/search/?monitor=id&online=false&last=true should get the
   * last time a monitor was offline.
   */
  it("should get the last time a monitor was offline", async () => {
    const res = await request(server).get(
      `/events-search/?monitor=${m2._id}&online=false&last=true`
    );

    expect(res.status).toEqual(200);
    expect(res.body[0]._id).toEqual(e5._id.toString());
  });
  // TODO: get last time monitor was online
  /**
   * GET /events/search/?monitor=id&online=true&last=true should get the
   * last time a monitor was online.
   */
  it("should get the last time a monitor was online", async () => {
    const res = await request(server).get(
      `/events-search/?monitor=${m2._id}&online=true&last=true`
    );

    expect(res.status).toEqual(200);
    expect(res.body[0]._id).toEqual(e6._id.toString());
  });
});
