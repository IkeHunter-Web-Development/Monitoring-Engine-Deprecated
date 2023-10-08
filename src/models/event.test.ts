import mongoose from "mongoose";
import Monitor from "./monitor.model";
import Event from "./event.model";

describe("Event", () => {
  it("should add an event", async () => {
    const monitor = {
      projectId: "123",
      url: "https://example.com",
      users: [],
      statusCode: 200,
      title: "Example",
    };

    await new Monitor(monitor).save();

    const event = {
      monitor: monitor,
      statusCode: 200,
      online: true,
      timestamp: new Date(),
    };

    await new Event(event).save();

    const events = await Event.find({});

    expect(events.length).toEqual(1);
  });
});
