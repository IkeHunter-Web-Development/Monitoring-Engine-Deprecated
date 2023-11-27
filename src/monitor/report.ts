import * as types from "src/monitor/models/report.types";
import Event from "src/event/models/model";
import EventManager from "src/event/event";
import { MonitorType } from "./models/monitor.types";
import { EventArray, EventArrayPromise } from "src/event/models/types";
import Report from "./models/report.model";

interface MinutesReport {
  uptime: number;
  downtime: number;
}

interface ParsedDates {
  startDate: Date;
  endDate: Date;
}

const getDayDifference = (startDate: Date, endDate: Date): number => {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export default class ReportManager {
  private static defaultDuration: number = 30;

  // TODO: optimize by making iterator to only iterate over events once
  private static async eventIterator(events: EventArray, ...callbacks: any): EventArrayPromise {
    return [];
  }

  private static parseDates(options: any): ParsedDates {
    let endDate = options?.endDate ? options.endDate : new Date();
    if (!(typeof endDate === typeof Date)) {
      endDate = new Date(endDate);
    }

    let startDate = options?.startDate
      ? options.startDate
      : new Date().setDate(endDate.getDate() - this.defaultDuration);
    if (!(typeof startDate === typeof Date)) {
      startDate = new Date(startDate);
    }

    return { startDate, endDate };
  }

  private static async getMinutesReport(events: EventArray): Promise<MinutesReport> {
    const totalDowntimeMinutes: number = <any>events.reduce(
      (downMinutes: any, currentEvent: any, i: number) => {
        if (currentEvent.online !== true) return downMinutes;

        let steps: number = 1;
        let prevEvent = events[i - steps];
        if (!prevEvent || (prevEvent && prevEvent.online === true)) return downMinutes;

        let downTime = 0;

        while (prevEvent.online !== true) {
          let timeDiff = currentEvent.timestamp.getTime() - prevEvent.timestamp.getTime();
          downTime += timeDiff;

          prevEvent = events[steps++];
        }

        return (downMinutes += downTime / (1000 * 60));
      },
      0
    );

    let eventStartTime: number = events[0].timestamp.getTime();
    let eventEndTime: number = events[events.length - 1].timestamp.getTime();
    const totalUptimeMinutes: number = (eventEndTime - eventStartTime) / (1000 * 60);

    return { uptime: totalUptimeMinutes, downtime: totalDowntimeMinutes };
  }

  private static async getDaysWithDowntime(events: EventArray): Promise<Array<Date>> {
    const days: Array<string> = [];

    for (let event of events) {
      if (!event.online) {
        let date: Date = event.timestamp;
        // let day: string = `${date.getMonth()}/${date.getDay() + 1}/${date.getFullYear()}`;
        let day: string = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        if (!days.includes(day)) days.push(day);
      }
    }

    return days.map((day) => new Date(day));
  }
  
  private static getAverageResponseTime(events: EventArray): number {
    const responseTimes: Array<number> = [];

    for (let event of events) {
      if (event.responseTime) responseTimes.push(event.responseTime);
    }
    
    let sum = responseTimes.reduce((sum, currentEvent) => sum + currentEvent, 0)
    
    
    return Math.ceil(sum/responseTimes.length)
  }

  /**
   * Generate report for monitor.
   *
   * @param MonitorType monitor, The monitor to generate the report for.
   * @param any options, Additional options to customize the report.
   */
  public static async generateReport(monitor: MonitorType, options?: any): types.ReportPromise {
    // const report: types.ReportType = {} as types.ReportType;
    // let report: types.ReportType;

    /** Start with initial time block */
    const dates: ParsedDates = this.parseDates(options);
    const initialStartDate: Date = dates.startDate;
    const initialEndDate: Date = dates.endDate;

    /** Get events using initial time block */
    const events = await EventManager.getEventsInRange(monitor, initialStartDate, initialEndDate);

    const reportStartDate: Date = events[0].timestamp;
    const reportEndDate: Date = events[events.length - 1].timestamp;
    const reportTotalDays: number = getDayDifference(reportStartDate, reportEndDate);

    const minutesReport: MinutesReport = await this.getMinutesReport(events);
    const daysWithDowntime: Array<Date> = await this.getDaysWithDowntime(events);

    const eventsWithDowntime: number = events.filter((event) => !event.online).length;
    const eventsWithUptime: number = events.length - eventsWithDowntime;

    const averageResponseTime: number = this.getAverageResponseTime(events);

    const report: types.ReportType = await Report.create({
      startDate: reportStartDate,
      endDate: reportEndDate,
      totalDays: reportTotalDays,
      totalUptimeMinutes: minutesReport.uptime,
      totalDowntimeMinutes: minutesReport.downtime,
      daysWithDowntime: daysWithDowntime as Date[],
      totalEvents: events.length,
      totalUptimeEvents: eventsWithUptime,
      totalDowntimeEvents: eventsWithDowntime,
      averageResponseTime: averageResponseTime,
    });

    return report;
  }
}
