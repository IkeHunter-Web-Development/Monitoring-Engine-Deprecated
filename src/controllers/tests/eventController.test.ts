/**
 * @fileoverview Tests for event api routes.
 */
import request from "supertest";
import server from "../../server";
import Monitor, { MonitorType } from "../../models/monitor.model";
import Event, { EventType } from "../../models/event.model";



describe("Event controller", () => {
  // TODO: get events for monitor
  it("should get events for monitor", async () => {
    expect(true).toEqual(true);
  });
  
  // TODO: get offline events for monitor
  // TODO: get last time monitor was offline
  // TODO: get last time monitor was online
  // TODO: get uptime for monitor
  // TODO: get downtime for monitor
  // TODO: get average response time for monitor
});
