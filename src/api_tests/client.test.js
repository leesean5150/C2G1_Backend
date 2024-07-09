import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("Testing Client Endpoints", () => {
  let app;

  beforeAll(async () => {
    app = await initializeApp();
  });

  test("create client account", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      username: "client",
      password: "client",
      email: "client@gmail.com",
    });
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.status).toBe(200);
  });

  test("testing login with client account", async () => {
    const response = await supertest(app).post("/auth/login/client").send({
      username: "client",
      password: "client",
    });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.status).toBe(200);
  });

  test("testing verification of client account", async () => {
    // test the verification of the client account
    // cookies should be set
    // status should be 200
  });

  test("testing deny entry of creating trainer account", async () => {
    // test the forbidden entry of creating trainer account
    // status should be 401
  });

  test("testing logout of client account", async () => {
    // test the logout of the client account
    // cookies should be cleared
    // status should be 200
    // verifiy endpoint should return 401
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
