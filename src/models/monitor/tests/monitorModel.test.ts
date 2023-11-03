/**
 * @fileoverview Tests for the monitor model.
 */
import Monitor from "../monitor.model";

/**
 * Tests for the monitor model.
 */
describe("Monitor", () => {
  let monitorData: any = {
    projectId: "123",
    companyId: "456",
    url: "https://example.com",
    users: [],
    statusCode: 200,
    title: "Example",
  };

  /**
   * Monitor models should be able to be created.
   */
  it("should create a monitor", async () => {
    const payload = { ...monitorData };

    const monitor = await Monitor.create(payload);

    expect(monitor).toBeDefined();
  });

  /**
   * Monitor models should be able to be updated.
   */
  it("should update a monitor", async () => {
    const payload = { ...monitorData };

    const monitor = await Monitor.create(payload);
    const updatedMonitor = await Monitor.updateOne({ _id: monitor._id }, { title: "Updated" });

    expect(updatedMonitor).toBeDefined();
  });

  /**
   * Monitor models should be able to be retrieved.
   */
  it("should get a monitor", async () => {
    const payload = { ...monitorData };

    const monitor = await Monitor.create(payload);
    const foundMonitor = await Monitor.findOne({ _id: monitor._id });

    expect(foundMonitor).toBeDefined();
  });

  /**
   * Monitor models should be able to be deleted.
   */
  it("should delete a monitor", async () => {
    const payload = { ...monitorData };

    const monitor = await Monitor.create(payload);
    await Monitor.deleteOne({ _id: monitor._id });
    const foundMonitor = await Monitor.findOne({ _id: monitor._id });

    expect(foundMonitor).toBeNull();
  });
});
