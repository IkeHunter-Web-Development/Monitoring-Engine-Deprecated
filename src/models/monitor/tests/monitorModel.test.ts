/**
 * @fileoverview Tests for the monitor model.
 */
import Project from "../../project/project.model";
import Monitor from "../monitor.model";
import Agency from "../../agency/agency.model";

/**
 * Tests for the monitor model.
 */
describe("Monitor", () => {
  let agency = {
    agencyId: "456",
    name: "Test agency",
  };
  let project = {
    agency: agency,
    projectId: "123",
    name: "Test Project",
  };
  let monitorData: any = {
    project: project,
    url: "https://example.com",
    users: [],
    statusCode: 200,
    title: "Example",
  };
  
  beforeEach(async () => {
    await Project.create(project);
    await Agency.create(agency);
  });

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
