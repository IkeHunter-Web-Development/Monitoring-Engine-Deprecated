import { Report, Event, Monitor } from "src/models";
import { MonitorResponse } from "src/models/responseModel";
import { EventService } from "src/services";

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

export class ReportService {
  private static defaultDuration: number = 30;

  // TODO: optimize by making iterator to only iterate over events once
  // private static async eventIterator(events: EventArray, ...callbacks: any): EventArrayPromise {
  //   return [];
  // }

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

  private static async getMinutesReport(events: Event[]): Promise<MinutesReport> {
    const totalDowntimeMinutes: number = <any>events.reduce(
      (downMinutes: any, currentEvent: any, i: number) => {
        if (currentEvent.online !== true) return downMinutes;

        let steps: number = 1;
        let prevEvent = events[i - steps];
        if (!prevEvent || (prevEvent && prevEvent.online === true)) return downMinutes;

        let downTime = 0;

        while (prevEvent.online !== true) {
          let timeDiff = currentEvent.timestamp.getTime() - prevEvent.timestamp!.getTime();
          downTime += timeDiff;

          prevEvent = events[steps++];
        }

        return (downMinutes += downTime / (1000 * 60));
      },
      0
    );

    let eventStartTime: number = events[0]?.timestamp!.getTime();
    // let eventEndTime: number = events[events.length - 1]?.timestamp!.getTime();
    let endTime: number = new Date().getTime();
    const totalUptimeMinutes: number = Math.ceil((endTime - eventStartTime) / (1000 * 60));

    return { uptime: totalUptimeMinutes, downtime: totalDowntimeMinutes };
  }

  private static async getDaysWithDowntime(events: Event[]): Promise<Array<Date>> {
    const days: Array<string> = [];

    for (let event of events) {
      if (!event.online) {
        let date: Date = event.timestamp!;
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

  private static getAverageResponseTime(responses: MonitorResponse[]): number {
    // const responseTimes: Array<number> = [];
    const responseTimes: number[] = responses.map((res) => res.responseTime);
    console.log("response times:", responseTimes);

    const sum = responseTimes.reduce((sum, currentEvent) => sum + currentEvent, 0);
    console.log("sum:", sum);

    const avg = Math.ceil(sum / responseTimes.length);
    console.log("avg:", avg);

    return avg;
  }

  /**
   * Generate report for monitor.
   *
   * @param MonitorType monitor, The monitor to generate the report for.
   * @param any options, Additional options to customize the report.
   */
  public static async generateReport(monitor: Monitor, options?: any): Promise<Report> {
    /** First check if there is a current report less than 1h old */
    const dayMs = new Date().getTime() - 1000 * 60 * 60 * 1;
    const existingReports = await Report.find({
      monitorId: monitor._id,
      createdAt: {
        $gte: new Date(dayMs),
        $lte: new Date(),
      },
    });
    if (existingReports.length > 0) {
      return existingReports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    }
    
    /** Create new report, Start with initial time block */
    const dates: ParsedDates = this.parseDates(options);
    const initialStartDate: Date = dates.startDate;
    const initialEndDate: Date = dates.endDate;

    /** Get events using initial time block */
    const events = await EventService.getEventsInRange(monitor, initialStartDate, initialEndDate);
    const responses = await MonitorResponse.find({ monitorId: monitor._id });

    const reportStartDate: Date = events[0]?.timestamp!;
    const reportEndDate: Date = events[events.length - 1]?.timestamp!;
    const reportTotalDays: number =
      reportStartDate && reportEndDate ? getDayDifference(reportStartDate, reportEndDate) : 0;

    const minutesReport: MinutesReport = await this.getMinutesReport(events);
    const daysWithDowntime: Array<Date> = await this.getDaysWithDowntime(events);

    const eventsWithDowntime: number = events.filter((event: Event) => !event.online).length;
    const eventsWithUptime: number = events.length - eventsWithDowntime;

    const averageResponseTime: number = this.getAverageResponseTime(responses);

    const report: Report = await Report.create({
      monitorId: monitor._id,
      startDate: reportStartDate || monitor.createdAt || new Date(), // if no events, get monitor date, else set today
      endDate: reportEndDate || new Date(),
      totalDays: reportTotalDays,
      totalUptimeMinutes: minutesReport.uptime || -1, // not enough time has passed
      totalDowntimeMinutes: minutesReport.downtime || 0, // assume no downtime by default
      daysWithDowntime: daysWithDowntime as Date[],
      totalEvents: events.length,
      totalUptimeEvents: eventsWithUptime || 0,
      totalDowntimeEvents: eventsWithDowntime || 0,
      averageResponseTime: averageResponseTime || 0, // not enough time has passed
    });

    return report;
  }
}
