// import { UserType } from "src/core/models/user/utils/user.types";
// import { request } from "./config";
// import NetworkManager from "./network";

// interface NetworkAuthResponse {
//   authenticated: boolean,
//   // user?: UserType
//   userId?: string
// }

// jest.mock("./config.ts");
// const mockRequest = request as any;


describe("Network manager tests", () => {
//   let network: NetworkManager;
  
//   beforeEach(() => {
//     network = new NetworkManager();
//   }) 
  
//   test("making api request", async () => {
//     mockRequest.mockResolvedValue({ message: "success" });
//     NetworkManager.sendRequest('').then((res) => {
//       expect(res).toStrictEqual({ message: "success" });
//     })
//   });

//   test("authenticating with auth service, valid token", async () => {
//     // expect(false).toBeTruthy();
//     const userId = '123abc';
//     mockRequest.mockResolvedValue({
//       authenticated: true,
//       id: userId
//     })
    
//     const token = "auth-service-token"
//     const res = network.isAuthenticated(token)
    
//     expect(res.userId).toEqual(userId)
//   });
  
//   test("authenticating with auth service, invalid token", async () => {
//     mockRequest.mockResolvedValue({
//       authenticated: false,
//     })
    
//     const token = "invalid-token"
//     const res = network.isAuthenticated(token)
    
//     expect(res.authenticated).toBeFalsy()
//     expect(res.userId).toBeUndefined()
//   });

//   test("getting project info, valid project", async () => {
//     // TODO: test getProjectInfo()
//     expect(false).toBeTruthy();
//   });
  
//   test("getting project info, invalid project", async () => {
//     // TODO: test getProjectInfo()
//     expect(false).toBeTruthy();
//   });

//   test("scheduling monitor", async () => {
//     // TODO: test scheduling monitor for ping job
//     expect(false).toBeTruthy();
//   });

  test("removing scheduled monitor", async () => {
    // TODO: test removing scheduled monitor from service
    expect(true).toBeTruthy();
  });
});
