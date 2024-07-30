import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { Admin } from "../auth/models/Admin";
import { Trainer } from "../auth/models/Trainer";
import bcrypt from "bcryptjs";

describe("Testing Admin Functionality", () => {
  let app;
  let tokenValue;
  let trainerId;

  beforeAll(async () => {
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

    // search for trainerId
    trainerId = await Trainer.findOne({ username: "trainer1" }).exec();
    trainerId = trainerId._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  // login tests
  test("testing invalid login", async () => {
    const response = await supertest(app).post("/auth/login/admin").send({
      username: "invalidusername",
      password: "invalidpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid username");
  });

  test("testing verification of logged-in admin", async () => {
    const response = await supertest(app)
      .get("/auth/verify")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Authorized");
    expect(response.body.role).toBe("admin");
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

  test("testing logout of admin account", async () => {
    const response = await supertest(app)
      .get("/auth/logout")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Logged out");
  });

  // create trainer account tests
  test("Create trainer with valid data", async () => {
    const response = await supertest(app)
      .post("/auth/trainers")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "newtrainer",
        email: "newtrainer@example.com",
        password: "password123",
        fullname: "New Trainer",
        trainer_role: "role",
      });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("newtrainer");
    expect(response.body.email).toBe("newtrainer@example.com");
  });

  test("Create trainer with missing required fields", async () => {
    const response = await supertest(app)
      .post("/auth/trainers")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "newtrainer2",
        email: "newtrainer2@example.com",
      });
    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  test("Create trainer with existing username or email", async () => {
    // Create a trainer first
    await supertest(app)
      .post("/auth/trainers")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "existingtrainer",
        email: "existingtrainer@example.com",
        password: "password123",
        fullname: "Existing Trainer",
        trainer_role: "role",
      });

    // Try to create another trainer with the same username
    const response1 = await supertest(app)
      .post("/auth/trainers")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "existingtrainer",
        email: "newemail@example.com",
        password: "password123",
        fullname: "New Trainer",
        trainer_role: "role",
      });
    expect(response1.status).toBe(500);
    expect(response1.body.message).toBeDefined();

    // Try to create another trainer with the same email
    const response2 = await supertest(app)
      .post("/auth/trainers")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "newusername",
        email: "existingtrainer@example.com",
        password: "password123",
        fullname: "New Trainer",
        trainer_role: "role",
      });
    expect(response2.status).toBe(500);
    expect(response2.body.message).toBeDefined();
  });

  // deactivate trainer account tests
  test("Deactivate trainer successfully", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/Deactivate/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Trainer successfully deactivated");
  });

  test("Deactivate trainer that is already inactive", async () => {
    // Try deactivating again
    const response = await supertest(app)
      .patch(`/auth/trainers/deactivate/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Trainer is already deactivated");
  });

  test("Deactivate trainer that does not exist", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/deactivate/invalidtrainerid`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid id");
  });

  // activate trainer account tests
  test("Activate trainer successfully", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/activate/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Trainer activated successfully");

    const updatedTrainer = await Trainer.findById(trainerId).exec();
    expect(updatedTrainer.availability).toBe("Active");
  });

  test("Activate trainer that is already active", async () => {
    // Try to activate again
    const response = await supertest(app)
      .patch(`/auth/trainers/activate/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Trainer is already active");
  });

  test("Activate trainer that does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await supertest(app)
      .patch(`/auth/trainers/activate/${nonExistentId}`)
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Trainer not found");
  });

  // get all trainers tests

  // // get all available trainers tests
  // test("Get available trainers with valid date range", async () => {
  //   const response = await supertest(app)
  //     .get("/auth/trainers/available")
  //     .query({ startTime: "2023-10-15", endTime: "2023-10-20" })
  //     .set("Cookie", `token=${tokenValue}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(2);
  // });

  // test("Get available trainers with no trainers available", async () => {
  //   const response = await supertest(app)
  //     .get("/auth/trainers/available")
  //     .query({ startTime: "2023-10-10", endTime: "2023-10-12" })
  //     .set("Cookie", `token=${tokenValue}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(1);
  // });

  // test("Get available trainers with invalid date format", async () => {
  //   const response = await supertest(app)
  //     .get("/auth/trainers/available")
  //     .query({ startTime: "invalid-date", endTime: "2023-10-20" })
  //     .set("Cookie", `token=${tokenValue}`);
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe(
  //     "Invalid date format. Please use YYYY-MM-DD."
  //   );
  // });

  // test("Get available trainers with start date in the past", async () => {
  //   const response = await supertest(app)
  //     .get("/auth/trainers/available")
  //     .query({ startTime: "2022-10-10", endTime: "2022-10-20" })
  //     .set("Cookie", `token=${tokenValue}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body.length).toBe(0);
  // });

  // delete trainer account tests

  // update trainer account tests

  // delete all trainers tests
});
