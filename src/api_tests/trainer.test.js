import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { Trainer } from "../auth/models/Trainer";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest";
import { Client } from "../auth/models/Client";

describe("Testing Trainer Endpoints", () => {
  let app;
  let tokenValue;
  let tokenValue_trainer;
  let workshopRequestId;

  beforeAll(async () => {
    try {
      app = await initializeApp();

      const login = async (url, credentials) => {
        const response = await supertest(app).post(url).send(credentials);
        if (!response.headers["set-cookie"]) {
          throw new Error(`${url} login failed: Set-Cookie header not found`);
        }
        return response;
      };

      const response_login = await login("/auth/login/admin", {
        username: process.env.SUPERUSER_USERNAME,
        password: process.env.SUPERUSER_PASSWORD,
      });

      const tokenCookie = response_login.headers["set-cookie"].find((cookie) =>
        cookie.startsWith("token=")
      );
      if (!tokenCookie) {
        throw new Error("Admin login failed: Token cookie not found");
      }
      tokenValue = tokenCookie.split("=")[1].split(";")[0];

      const response_login_trainer = await login("/auth/login/trainer", {
        username: "trainer1",
        password: "trainer1",
      });

      const tokenCookie_trainer = response_login_trainer.headers[
        "set-cookie"
      ].find((cookie) => cookie.startsWith("token="));
      if (!tokenCookie_trainer) {
        throw new Error("Trainer login failed: Token cookie not found");
      }
      tokenValue_trainer = tokenCookie_trainer.split("=")[1].split(";")[0];

      const client = await Client.findOne({});
      if (!client) {
        throw new Error("Client not found");
      }

      const workshopRequest = new WorkshopRequest({
        company_role: "Clerk",
        company: "sutd",
        name: "sean",
        email: "sdf",
        phone_number: 345,
        pax: 345,
        deal_potential: 345,
        country: "sfadg",
        venue: "asdfgfsd",
        start_date: "07/25/2024",
        end_date: "07/26/2024",
        request_message: "sdf",
        workshop_data_id: "02",
        client_id: client._id,
      });
      await workshopRequest.save();
      workshopRequestId = workshopRequest._id.toString();
    } catch (error) {
      console.error("Error in beforeAll setup:", error);
      throw error; // Rethrow to fail the tests if setup fails
    }
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await mongoose.disconnect();
    if (app && app.close) {
      await app.close();
    }
  });

  // trainer login tests
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

  // getteammates tests
  test("should return 404 if trainer not found", async () => {
    jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    const response = await supertest(app)
      .get("/auth/getteammates")
      .set("Cookie", `token=${tokenValue}`);

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

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: false,
      message: "Internal Server Error",
    });
  });

  // getOthers tests
  test("should return 404 if no trainers found", async () => {
    jest.spyOn(Trainer, "find").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    const response = await supertest(app)
      .get("/auth/getothers")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "Trainer not found",
    });

    jest.clearAllMocks();
  });

  test("should return 200 with empty list if trainers exist but no workshop requests", async () => {
    jest.spyOn(Trainer, "find").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ workshopRequests: [] }]), // Return trainers with no workshop requests
      }),
    });

    const response = await supertest(app)
      .get("/auth/getothers")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ workshopRequests: [] }]);

    jest.clearAllMocks();
  });

  test("should return 200 with trainers and their workshop requests", async () => {
    jest.spyOn(Trainer, "find").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            username: "trainer",
            workshop_request: [
              {
                workshop_ID: "ID1",
              },
            ],
          },
        ]),
      }),
    });
    const response = await supertest(app)
      .get("/auth/getothers")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: "trainer",
          workshop_request: expect.arrayContaining([
            expect.objectContaining({
              workshop_ID: "ID1",
            }),
          ]),
        }),
      ])
    );
    jest.clearAllMocks();
  });

  // updateUtilisation tests
  test("should update utilisation successfully", async () => {
    const response = await supertest(app)
      .patch(`/auth/updateutilisation/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send([{ date: "2023-10-01", hours: 5 }]);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Utilisation updated successfully");
  });

  test("should return 404 if WorkshopRequest not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await supertest(app)
      .patch(`/auth/updateutilisation/${nonExistentId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send([{ date: "2023-10-01", hours: 5 }]);
    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("WorkshopRequest not found");
  });

  test("should return 400 for invalid ID format", async () => {
    const response = await supertest(app)
      .patch(`/auth/updateutilisation/invalidId`)
      .set("Cookie", `token=${tokenValue}`)
      .send([{ date: "2023-10-01", hours: 5 }]);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Invalid ID format");
  });

  test("should return 400 for invalid utilisation data", async () => {
    const response = await supertest(app)
      .patch(`/auth/updateutilisation/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({ date: "2023-10-01", hours: 5 });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Invalid utilisation data");
  });

  // getAllocatedWorkshops tests
  test("should return 200 and trainer's workshop requests", async () => {
    const mockTrainer = {
      _id: new mongoose.Types.ObjectId(),
      workshop_request: [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          workshop_data: { name: "Workshop 1" },
        },
      ],
    };

    const findByIdMock = jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTrainer),
      }),
    });

    const response = await supertest(app)
      .get("/auth/allocatedworkshops")
      .set("Cookie", `token=${tokenValue_trainer}`);

    expect(response.status).toBe(200);
    expect(response.body.trainer_workshops).toEqual(
      mockTrainer.workshop_request
    );
  });

  test("should return 404 if trainer not found", async () => {
    jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });

    const response = await supertest(app)
      .get("/auth/allocatedworkshops")
      .set("Cookie", `token=${tokenValue_trainer}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Trainer not found");
  });

  test("should return 500 if there is a server error", async () => {
    jest.spyOn(Trainer, "findById").mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Server error")),
      }),
    });

    const response = await supertest(app)
      .get("/auth/allocatedworkshops")
      .set("Cookie", `token=${tokenValue_trainer}`);

    expect(response.status).toBe(500);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Server error");
  });
});
