import EventManager from "src/event/event";
import Monitor from "../models/monitor.model";
import { MonitorType, ReportType } from "../models/types";
import MonitorManager from "../monitor";
import ReportManager from "../report";
import { EventArray, EventArrayPromise, EventType } from "src/event/models/types";
import { getRandomIntInclusive } from "src/utils/utils";
import exampleEvents from "src/event/examples/events";
import { Schema } from "mongoose";

// const rint = getRandomIntInclusive;

const defaultMonitor = {
  projectId: "abc",
  url: "https://example.com",
  users: [],
  statusCode: 200,
  active: true,
  title: "Example Live",
  online: true,
  type: "HTTP",
  interval: 60,
  timeout: 1000,
  retries: 3,
};

describe("Report manager simple tests", () => {
  it("should create report from monitor with few events", async () => {
    const m: MonitorType = await MonitorManager.createMonitor(defaultMonitor);
    const events: EventArray = [];
    const onlineEventData = [
      { timestamp: new Date("11/24/23 10:00:00"), responseTime: 200 },
      { timestamp: new Date("11/24/23 11:00:00"), responseTime: 400 },
      { timestamp: new Date("11/24/23 12:00:00"), responseTime: 150 },
      { timestamp: new Date("11/24/23 13:00:00"), responseTime: 500 },
    ];

    for (let data of onlineEventData) {
      let e: EventType = await EventManager.createEvent({
        monitor: m._id,
        statusCode: 200,
        online: true,
        timestamp: data.timestamp,
        responseTime: data.responseTime,
      });
      events.push(e);
    }

    const report: ReportType = await ReportManager.generateReport(m);
    const sampleDate: Date = new Date("11/24/23");

    expect(report.startDate).toEqual(report.endDate);
    expect(report.startDate.getUTCDate()).toEqual(sampleDate.getUTCDate());
    expect(report.totalDowntimeMinutes).toEqual(0);
    expect(report.totalUptimeMinutes).toEqual(240);
    expect(report.totalEvents).toEqual(4);
    expect(report.totalDowntimeEvents).toEqual(0);
    expect(report.totalUptimeEvents).toEqual(4);
    expect(report.averageResponseTime).toEqual(313); // round up from 312.5
  });
  // it("should only get data between start and end dates", async () => {

  // });
  // it("should accurately calculate average response time", async () => {
  //   // TODO: report calculates response time
  //   expect(false).toBeTruthy();
  // });
});

describe("Report manager with many events", () => {
  const startDate: Date = new Date("11/1/23");
  const endDate: Date = new Date("11/30/23");
  const events: EventArray = [];
  const monthEvents: EventArray = [];
  let m: MonitorType;
  let report: ReportType;
  // let totalDownTimeMinutes: number;
  // let totalUptimeMinutes: number;

  beforeAll(async () => {
    m = await MonitorManager.createMonitor(defaultMonitor);

    exampleEvents.sort((eventA, eventB) => {
      let timeA = new Date(eventA.timestamp.$date);
      let timeB = new Date(eventB.timestamp.$date);

      return timeB.getTime() - timeA.getTime();
    });

    for (let obj of exampleEvents) {
      let responseTime: number | null = +obj.responseTime || null;
      
      let newEvent = await EventManager.createEvent({
        monitorId: m._id,
        statusCode: obj.statusCode,
        online: obj.online,
        timestamp: new Date(obj.timestamp.$date),
        message: obj.message || "",
        resposneTime: responseTime,
      });

      events.push(newEvent);

      let newEventTime = newEvent.timestamp.getTime();
      if (newEventTime >= startDate.getTime() && newEventTime <= endDate.getTime()) {
        monthEvents.push(newEvent);
      }
    }

    report = await ReportManager.generateReport(m, {
      startDate: startDate,
      endDate: endDate,
    });
  });

  it("should calculate events only between dates", async () => {
    expect(report.startDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
    expect(report.endDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
    expect(report.totalDays).toEqual(30);
  });

  it("should calculate correct down/uptime minutes", async () => {
    const totalDownTimeMinutes: number = <any>monthEvents.reduce(
      (downMinutes: any, currentEvent: any, i: number) => {
        if (currentEvent.online !== true) return downMinutes;

        let steps: number = 1;
        let prevEvent = monthEvents[i - steps];
        if (prevEvent.online === true) return downMinutes;

        let downTime = 0;

        while (prevEvent.online !== true) {
          let timeDiff = currentEvent.timestamp.getTime() - prevEvent.timestamp.getTime();
          downTime += timeDiff;

          prevEvent = monthEvents[steps++];
        }

        return (downMinutes += downTime * 1000 * 60);
      },
      0
    );

    let eventStartTime: number = monthEvents[0].timestamp.getTime();
    let eventEndTime: number = monthEvents[-1].timestamp.getTime();
    const totalUptimeMinutes: number = (eventEndTime - eventStartTime) * 1000 * 60;

    expect(report.totalDowntimeMinutes).toEqual(totalDownTimeMinutes);
    expect(report.totalUptimeMinutes).toEqual(totalUptimeMinutes);
  });

  it("should return correct days with downtime", async () => {
    const days: Array<string> = [];

    for (let event of monthEvents) {
      if (!event.online) {
        let date = event.timestamp;
        let day = `${date.getMonth()}-${date.getDay()}-${date.getFullYear}`;
        if (!days.includes(day)) days.push(day);
      }
    }

    expect(report.daysWithDowntime.length).toEqual(days.length);
    let parsedDays = report.daysWithDowntime.map((day) => {
      return `${day.getMonth()}-${day.getDay()}-${day.getFullYear()}`;
    });

    for (let reportDay of parsedDays) {
      expect(days).toContain(reportDay);
    }
  });
  it("should calculate correct amount of events", async () => {
    const totalEvents: number = monthEvents.length;
    const downEvents: number = <any>monthEvents.reduce(
      (downEventsCount: any, currentEvent: any) => {
        if (!currentEvent.online) downEventsCount++;

        return downEventsCount;
      },
      0
    );
    const upEvents: number = totalEvents - downEvents;

    expect(report.totalEvents).toEqual(totalEvents);
    expect(report.totalDowntimeEvents).toEqual(downEvents);
    expect(report.totalUptimeEvents).toEqual(upEvents);
  });
  it("should calculate average response time", async () => {
    // const averageResponseTime: number = <any>monthEvents.reduce(
    //   (responseTime: any, currentEvent: any) => {
    //     if (responseTime === 0) return currentEvent.responseTime || 0;

    //     return (responseTime + currentEvent) / 2;
    //   }
    // );
    let averageResponseTime: number = 0;

    for (let event of monthEvents) {
      if (averageResponseTime === 0) averageResponseTime = event.responseTime || 0;
      if (!event.responseTime || event.responseTime === 0) break;

      averageResponseTime = (averageResponseTime + event.responseTime) / 2;
    }

    // TODO: calculates incorrect value
    expect(report.averageResponseTime).toEqual(averageResponseTime);
  });
});
