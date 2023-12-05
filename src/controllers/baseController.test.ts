/**
 * @fileoverview Test general routes for the API.
 */
import request from "supertest";
import { server } from "src/config";

describe("Main controller", () => {
  it("should return a health check", async () => {
    const res = await request(server).get("/");

    expect(res.status).toEqual(200);
  });
});
