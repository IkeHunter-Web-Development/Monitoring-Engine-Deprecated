import request from "supertest";
import { server } from "src/config";

describe("monitorRouter", () => {
  it("should return 200 OK", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toEqual(200);
  });
  // it("should return empty list of monitors", async () => {
  //   const res = await request(server).get("/api/monitors");
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toEqual([]);
  // });
});
