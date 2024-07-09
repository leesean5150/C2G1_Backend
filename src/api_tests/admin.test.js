import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("Testing Admin Functionality", () => {
  let app;

  beforeAll(async () => {
    app = await initializeApp();
  });
  test("testing login with superuser account", async () => {
    const response = await supertest(app).post("/auth/login/admin").send({
        username: process.env.SUPERUSER_USERNAME,
        password: process.env.SUPERUSER_PASSWORD,
    });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
