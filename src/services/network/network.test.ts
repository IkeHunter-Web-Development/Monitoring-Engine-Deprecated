import { request } from "./config";
import NetworkManager from "./network";

jest.mock("./config.ts");

const mockRequest = request as any;


describe("Network manager tests", () => {
  test("making api request", async () => {
    mockRequest.mockResolvedValue({ message: "success" });
    NetworkManager.sendRequest('').then((res) => {
      expect(res).toStrictEqual({ message: "success" });
    })
  });

  test("authenticating with auth service, valid token", async () => {
    // TODO: test authenticate()
    expect(false).toBeTruthy();
  });
  
  test("authenticating with auth service, invalid token", async () => {
    // TODO: test authenticate()
    expect(false).toBeTruthy();
  });

  test("getting project info, valid project", async () => {
    // TODO: test getProjectInfo()
    expect(false).toBeTruthy();
  });
  
  test("getting project info, invalid project", async () => {
    // TODO: test getProjectInfo()
    expect(false).toBeTruthy();
  });

  test("scheduling monitor", async () => {
    // TODO: test scheduling monitor for ping job
    expect(false).toBeTruthy();
  });

  test("removing scheduled monitor", async () => {
    // TODO: test removing scheduled monitor from service
    expect(false).toBeTruthy();
  });
});
