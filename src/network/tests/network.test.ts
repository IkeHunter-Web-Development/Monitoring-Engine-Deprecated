import { Network, request } from "src/network";
import { Monitor } from "src/models";
import { generateMonitor } from "src/utils/testing";

// interface NetworkAuthResponse {
//   authenticated: boolean;
//   // user?: UserType
//   userId?: string;
// }

jest.mock("../config.ts");
const mockRequest = request as any;

describe("Network manager tests", () => {

  test("making api request", async () => {
    mockRequest.mockResolvedValue({ message: "success" });
    Network.sendRequest("").then((res) => {
      expect(res).toStrictEqual({ message: "success" });
    });
  });

  test("authenticating with auth service, valid token", async () => {
    const userId = "123abc";
    const expected: NetworkAuthResponse = {
      status: 200,
      authenticated: true,
      userId: userId,
    };
    mockRequest.mockResolvedValue(expected);

    const token = "auth-service-token";
    const res: NetworkAuthResponse = await Network.authenticate(token);

    expect(res.userId).toEqual(userId);
  });

  test("authenticating with auth service, invalid token", async () => {
    const expected: NetworkAuthResponse = {
      status: 401,
      authenticated: false,
    };
    mockRequest.mockResolvedValue(expected);

    const token = "invalid-token";
    const res = await Network.authenticate(token);

    expect(res.authenticated).toBeFalsy();
    expect(res.userId).toBeUndefined();
  });

  test("getting project info, valid project", async () => {
    const expected: NetworkProjectInfo = {
      status: 200,
      projectName: "Example Project",
      company: "Example Company",
    };
    mockRequest.mockResolvedValue(expected);
    const monitor: Monitor = await generateMonitor();

    const token = "valid-token";
    const res = await Network.getProjectInfo(token, monitor);

    expect(res.projectName).toEqual("Example Project");
    expect(res.company).toEqual("Example Company");
  });

  test("getting project info, invalid project", async () => {
    const expected: NetworkProjectInfo = {
      status: 404,
    };
    mockRequest.mockResolvedValue(expected);
    
    const monitor: Monitor = await generateMonitor();
    
    const token = "valid-token";
    const res = await Network.getProjectInfo(token, monitor);
    
    expect(res.projectName).toBeUndefined();
    expect(res.company).toBeUndefined();
    expect(res.status).toEqual(404);
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
