import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { Trainer } from "../auth/models/Trainer"; // Import the Trainer model

describe("Testing Trainer Endpoints", () => {
  let app;
  let tokenValue;

  beforeAll(async () => {
    app = await initializeApp();

    const response_login = await supertest(app).post("/auth/login/admin").send({
      username: process.env.SUPERUSER_USERNAME,
      password: process.env.SUPERUSER_PASSWORD,
    });
    const tokenCookie = response_login.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("token=")
    );
    tokenValue = tokenCookie.split("=")[1].split(";")[0];
  });

  test("testing invalid login", async () => {
    const response = await supertest(app).post("/auth/login/trainer").send({
      username: "invalidusername",
      password: "invalidpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid username");
  });

  test("testing login with trainer account", async () => {
    const response = await supertest(app).post("/auth/login/trainer").send({
      username: "trainer1",
      password: "trainer1",
    });
    const tokenCookie = response.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("token=")
    );
    tokenValue = tokenCookie.split("=")[1].split(";")[0];
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.status).toBe(200);
  });

  test("testing verification of logged-in trainer", async () => {
    const response = await supertest(app)
      .get("/auth/verify")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Authorized");
    expect(response.body.role).toBe("trainer");
  });

  test("testing verification without a token (unauthorized)", async () => {
    const response = await supertest(app).get("/auth/verify");
    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
  });

  test("testing verification with an invalid token (unauthorized)", async () => {
    const response = await supertest(app)
      .get("/auth/verify")
      .set("Cookie", `token=invalidtoken`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
  });

  test("testing logout of trainer account", async () => {
    const response = await supertest(app)
      .get("/auth/logout")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Logged out");
  });

  test("should return 404 if trainer not found", async () => {
    jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    const response = await supertest(app)
      .get("/auth/getteammates")
      .set("Cookie", `token=${tokenValue}`);

    console.log(response.body); // Add logging to see the response body

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "Trainer not found",
    });
  });

  test("should return 200 and trainer's workshop requests", async () => {
    const mockTrainer = {
      _id: "trainerId",
      workshop_request: [
        {
          _id: "workshopRequestId",
          trainers: [{ _id: "trainerId1" }, { _id: "trainerId2" }],
        },
      ],
    };

    jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTrainer),
      }),
    });
    const response = await supertest(app)
      .get("/auth/getteammates")
      .set("Cookie", `token=${tokenValue}`);

    console.log(response.body); // Add logging to see the response body

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      trainer_workshops: mockTrainer.workshop_request,
    });
  });

  test("should return 500 if there is an internal server error", async () => {
    jest.spyOn(Trainer, "findById").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await supertest(app)
      .get("/auth/getteammates")
      .set("Cookie", `token=${tokenValue}`);

    console.log(response.body); // Add logging to see the response body

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      message: "Internal Server Error",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
