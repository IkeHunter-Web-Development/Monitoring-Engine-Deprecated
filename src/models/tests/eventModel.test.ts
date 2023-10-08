/**
 * @fileoverview Tests for the Event model.
 */
import Monitor from "../monitor.model";
import Event from "../event.model";

/**
 * Tests for the Event model.
 */
describe("Event", () => {
  let monitor: any;

  /**
   * Create a monitor before each test.
   */
  beforeEach(async () => {
    let payload = {
      projectId: "123",
      url: "https://example.com",
      users: [],
      statusCode: 200,
      title: "Example",
    };

    monitor = await Monitor.create(payload);
  });

  /**
   * Event models should be able to be created.
   */
  it("should add an event", async () => {
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

  /**
   * Event models should be able to be updated.
   */
  it("should update an event", async () => {
    const event = {
      monitor: monitor,
      statusCode: 200,
      online: true,
      timestamp: new Date(),
    };

    await new Event(event).save();

    const updatedEvent = {
      monitor: monitor,
      statusCode: 200,
      online: false,
      timestamp: new Date(),
    };

    await Event.updateOne(updatedEvent);

    const events = await Event.find({});

    expect(events[0].online).toEqual(false);
  });

  /**
   * Event models should be able to be retrieved.
   */
  it("should get an event", async () => {
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

  /**
   * Event models should be able to be deleted.
   */
  it("should delete an event", async () => {
    const event = {
      monitor: monitor,
      statusCode: 200,
      online: true,
      timestamp: new Date(),
    };

    let obj = await new Event(event).save();

    await Event.deleteOne({ _id: obj._id });

    const events = await Event.find({});

    expect(events.length).toEqual(0);
  });
});
