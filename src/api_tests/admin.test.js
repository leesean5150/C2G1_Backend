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

  test("testing verification of admin account", async () => {
    // test the verification of the client account
    // cookies should be set
    // status should be 200
  });

  test("testing creation trainer account", async () => {
    // test the creation of a trainer account
    // status should be 200
    // maybe check if trainer list is non-zero?
  });

  test("testing allocation of trainer to workshop", async () => {
    // create a workshop
    // test the allocation of a trainer to a workshop
    // status should be 200
    // maybe check if workshop has a trainer?
  });

  test("testing logout of admin account", async () => {
    // test the logout of the client account
    // cookies should be cleared
    // status should be 200
    // verifiy endpoint should return 401
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
