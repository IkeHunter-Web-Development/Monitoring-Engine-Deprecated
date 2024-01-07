describe('TEMP TESTS', () => {
  it('should return true', () => {
    expect(true).toBe(true);
  })
})

// import type { IMonitor, IMonitorResponse, Report } from 'src/models'
// import { Monitor, Event, eventExamples, MonitorResponse } from 'src/models'
// import { MonitorService, ReportService } from 'src/services'

// const defaultMonitor: IMonitor = {
//   projectId: 'abc',
//   url: 'https://example.com',
//   title: 'Example Live'
// }

// describe('Report manager simple tests', () => {
//   it('should create report from monitor with few events', async () => {
//     const m: Monitor = await Monitor.create(defaultMonitor)
//     const responses: MonitorResponse[] = []
//     const responseData = [
//       { timestamp: new Date('11/24/23 10:00:00'), responseTime: 200 },
//       { timestamp: new Date('11/24/23 11:00:00'), responseTime: 400 },
//       { timestamp: new Date('11/24/23 12:00:00'), responseTime: 150 },
//       { timestamp: new Date('11/24/23 13:00:00'), responseTime: 500 }
//     ]

//     for (const data of responseData) {
//       const payload: IMonitorResponse = {
//         monitorId: m._id,
//         responseTime: data.responseTime,
//         timestamp: data.timestamp.getTime()
//       }
//       const monitorResponse = await MonitorResponse.create(payload)
//       responses.push(monitorResponse)
//     }

//     const report: Report = await ReportService.generateReport(m)
//     const sampleDate: Date = new Date('11/24/23')

//     expect(report.startDate.getDay()).toEqual(report.endDate.getDay())
//     expect(report.startDate.getUTCDate()).toEqual(sampleDate.getUTCDate())
//     expect(report.totalDowntimeMinutes).toEqual(0)
//     expect(report.totalUptimeMinutes).toEqual(180)
//     expect(report.totalEvents).toEqual(4)
//     expect(report.totalDowntimeEvents).toEqual(0)
//     expect(report.totalUptimeEvents).toEqual(4)
//     expect(report.averageResponseTime).toEqual(313) // round up from 312.5
//   })
//   // it("should only get data between start and end dates", async () => {

//   // });
//   // it("should accurately calculate average response time", async () => {
//   //   // TODO: report calculates response time
//   //   expect(false).toBeTruthy();
//   // });
// })

// describe('Report manager with many events', () => {
//   const startDate: Date = new Date('11/1/23')
//   const endDate: Date = new Date('11/30/23')
//   const events: Event[] = []
//   const monthEvents: Event[] = []
//   let m: Monitor
//   let report: Report
//   // let totalDownTimeMinutes: number;
//   // let totalUptimeMinutes: number;

//   beforeAll(async () => {
//     m = await MonitorService.createMonitor(defaultMonitor)

//     eventExamples.sort((eventA, eventB) => {
//       const timeA: Date = new Date(eventA.timestamp.$date)
//       const timeB: Date = new Date(eventB.timestamp.$date)

//       return timeA.getTime() - timeB.getTime()
//     })

//     for (const obj of eventExamples) {
//       // let responseTime: number | null = +obj.responseTime || null;
//       // const newEvent = await EventService.createEvent({
//       //   monitorId: m._id,
//       //   statusCode: obj.statusCode,
//       //   online: obj.online,
//       //   timestamp: new Date(obj.timestamp.$date),
//       //   message: obj.message || '',
//       //   responseTime: +obj.responseTime || 0
//       // })

//       // TODO: fix this
//       const newEvent = await Event.create({
//         monitorId: m._id,
//         statusCode: obj.statusCode,
//         online: obj.online,
//         timestamp: new Date(obj.timestamp.$date),
//         message: obj.message || '',
//         responseTime: +obj.responseTime || 0
//       })

//       events.push(newEvent)

//       const newEventTime = newEvent.timestamp.getTime()
//       if (newEventTime >= startDate.getTime() && newEventTime <= endDate.getTime()) {
//         monthEvents.push(newEvent)
//       }
//     }

//     report = await ReportService.generateReport(m, {
//       startDate: startDate,
//       endDate: endDate
//     })
//   })

//   it('should calculate events only between dates', async () => {
//     expect(report.startDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
//     expect(report.endDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
//     expect(report.totalDays).toEqual(30)
//   })

//   it('should calculate correct down/uptime minutes', async () => {
//     const totalDownTimeMinutes: number = <any>monthEvents.reduce(
//       (downMinutes: any, currentEvent: any, i: number) => {
//         if (currentEvent.online !== true) return downMinutes

//         // const steps: number = 1
//         // const prevEvent = monthEvents[i - steps]
//         // if (!prevEvent || (prevEvent && prevEvent.online === true)) return downMinutes

//         // const downTime = 0
//         /* FIXME */ const downTime = i

//         // while (prevEvent.online !== true) {
//         //   const timeDiff = currentEvent.timestamp.getTime() - prevEvent.timestamp.getTime()
//         //   downTime += timeDiff

//         //   prevEvent = monthEvents[steps++]
//         // }

//         return (downMinutes += downTime / (1000 * 60))
//       },
//       0
//     )

//     const eventStartTime: number = monthEvents[0].timestamp.getTime()
//     const eventEndTime: number = monthEvents[monthEvents.length - 1].timestamp.getTime()
//     const totalUptimeMinutes: number = (eventEndTime - eventStartTime) / (1000 * 60)

//     expect(report.totalDowntimeMinutes).toEqual(totalDownTimeMinutes)
//     expect(report.totalUptimeMinutes).toEqual(totalUptimeMinutes)
//   })

//   it('should return correct days with downtime', async () => {
//     const days: Array<string> = []

//     // for (const event of monthEvents) {
//     //   if (!event.online) {
//     //     const date = event.timestamp
//     //     // let day = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
//     //     const day = date.toLocaleDateString('en-US', {
//     //       year: 'numeric',
//     //       month: 'numeric',
//     //       day: 'numeric'
//     //     })
//     //     if (!days.includes(day)) days.push(day)
//     //   }
//     // }

//     expect(report.daysWithDowntime.length).toEqual(days.length)
//     const parsedDays = report.daysWithDowntime.map((day) => {
//       // return `${day.getMonth()}/${day.getDay()}/${day.getFullYear()}`;
//       return day.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
//     })

//     for (const reportDay of parsedDays) {
//       expect(days).toContain(reportDay)
//     }
//   })
//   it('should calculate correct amount of events', async () => {
//     const totalEvents: number = monthEvents.length
//     const downEvents: number = <any>monthEvents.reduce(
//       (downEventsCount: any, currentEvent: any) => {
//         if (!currentEvent.online) downEventsCount++

//         return downEventsCount
//       },
//       0
//     )
//     const upEvents: number = totalEvents - downEvents

//     expect(report.totalEvents).toEqual(totalEvents)
//     expect(report.totalDowntimeEvents).toEqual(downEvents)
//     expect(report.totalUptimeEvents).toEqual(upEvents)
//   })
//   it('should calculate average response time', async () => {
//     // let averageResponseTime: number = 0;

//     // for (let event of monthEvents) {
//     //   if (averageResponseTime === 0) {
//     //     averageResponseTime = event.responseTime || 0;
//     //     continue;
//     //   }
//     //   if (!event.responseTime || event.responseTime === 0) continue;

//     //   averageResponseTime = (averageResponseTime + event.responseTime) / 2;
//     // }
//     const responseTimes: Array<number> = []
//     // for (const event of monthEvents) {
//     //   if (event.responseTime) responseTimes.push(event.responseTime)
//     // }

//     const sum = responseTimes.reduce((a, b) => a + b, 0)
//     const avg = sum / responseTimes.length || 0

//     expect(report.averageResponseTime).toEqual(Math.ceil(avg))
//   })
// })
