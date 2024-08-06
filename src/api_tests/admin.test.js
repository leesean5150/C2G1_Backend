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
      username: "admin",
      password: "admin",
    });

    const tokenCookie = response_login.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("token=")
    );
    if (!tokenCookie) {
      throw new Error("Admin login failed: Token cookie not found");
    }
    tokenValue = tokenCookie.split("=")[1].split(";")[0];

    // search for trainerId
    trainerId = await Trainer.findOne({
      username: { $in: ["trainer", "trainer1"] },
    }).exec();
    trainerId = trainerId._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (app && app.close) {
      await app.close();
    }
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
  test("should return all trainers", async () => {
    const response = await supertest(app)
      .get("/auth/trainers/list")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((trainer) => {
      expect(trainer).toHaveProperty("username");
      expect(trainer).toHaveProperty("email");
      expect(trainer).toHaveProperty("fullname");
      expect(trainer).toHaveProperty("trainer_role");
    });
  });

  test("should handle errors when database query fails", async () => {
    // Mock the Trainer.find method to throw an error
    jest.spyOn(Trainer, "find").mockImplementationOnce(() => {
      throw new Error("Database query failed");
    });

    const response = await supertest(app)
      .get("/auth/trainers/list")
      .set("Cookie", `token=${tokenValue}`);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Database query failed");
  });

  // get all available trainers tests
  test("should return 400 for invalid date format", async () => {
    const response = await supertest(app)
      .get("/auth/trainers/available")
      .set("Cookie", `token=${tokenValue}`)
      .query({ startTime: "invalid-date", endTime: "invalid-date" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid date format. Please use YYYY-MM-DD."
    );
  });

  test("should return 200 with empty array for start date in the past", async () => {
    const pastDate = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0]; // Yesterday's date
    const futureDate = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0]; // Tomorrow's date

    const response = await supertest(app)
      .get("/auth/trainers/available")
      .set("Cookie", `token=${tokenValue}`)
      .query({ startTime: pastDate, endTime: futureDate });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should return 200 with empty array for start date equal to current date", async () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Today's date
    const futureDate = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0]; // Tomorrow's date

    const response = await supertest(app)
      .get("/auth/trainers/available")
      .set("Cookie", `token=${tokenValue}`)
      .query({ startTime: currentDate, endTime: futureDate });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should return 200 with empty array for valid date range with no trainers available", async () => {
    jest.spyOn(Trainer, "find").mockResolvedValueOnce([]);

    const futureDate1 = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0]; // Tomorrow's date
    const futureDate2 = new Date(Date.now() + 172800000)
      .toISOString()
      .split("T")[0]; // Day after tomorrow's date

    const response = await supertest(app)
      .get("/auth/trainers/available")
      .set("Cookie", `token=${tokenValue}`)
      .query({ startTime: futureDate1, endTime: futureDate2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should return 200 with trainers for valid date range with trainers available", async () => {
    const mockTrainers = [
      { name: "Trainer 1", availability: "Active", unavailableTimeslots: [] },
      { name: "Trainer 2", availability: "Active", unavailableTimeslots: [] },
    ];
    jest.spyOn(Trainer, "find").mockResolvedValueOnce(mockTrainers);

    const futureDate1 = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0]; // Tomorrow's date
    const futureDate2 = new Date(Date.now() + 172800000)
      .toISOString()
      .split("T")[0]; // Day after tomorrow's date

    const response = await supertest(app)
      .get("/auth/trainers/available")
      .set("Cookie", `token=${tokenValue}`)
      .query({ startTime: futureDate1, endTime: futureDate2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTrainers);
  });

  // update trainer account tests
  test("Update trainer with valid data", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/update/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "updatedtrainer",
        email: "updatedtrainer@example.com",
        fullname: "Updated Trainer",
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Trainer updated successfully");
  });

  test("Update trainer with missing required fields", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/update/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No fields to update");
  });

  test("Update trainer with invalid ID", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/update/invalidid`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "updatedtrainer",
        email: "updatedtrainer@example.com",
        fullname: "Updated Trainer",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid id");
  });

  test("Update trainer that does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await supertest(app)
      .patch(`/auth/trainers/update/${nonExistentId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        username: "updatedtrainer",
        email: "updatedtrainer@example.com",
        fullname: "Updated Trainer",
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Trainer not found");
  });

  test("Update trainer with no fields to update", async () => {
    const response = await supertest(app)
      .patch(`/auth/trainers/update/${trainerId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No fields to update");
  });

  // delete trainer account tests
  test("Delete trainer successfully", async () => {
    // Create a trainer first
    const trainerData = {
      username: "deletetrainer",
      email: "deletetrainer@example.com",
      password: "password123",
      fullname: "Delete Trainer",
      trainer_role: "role",
    };
    const hashpassword = await bcrypt.hash(trainerData.password, 10);
    const trainer = new Trainer({
      ...trainerData,
      password: hashpassword,
    });
    const savedTrainer = await trainer.save();

    // Delete the trainer
    const response = await supertest(app)
      .delete(`/auth/trainers/delete/${savedTrainer._id}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Trainer deleted successfully");
  });

  test("Delete non-existent trainer", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await supertest(app)
      .delete(`/auth/trainers/delete/${nonExistentId}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Trainer not found");
  });

  test("Delete trainer with invalid ID", async () => {
    const invalidId = "12345";
    const response = await supertest(app)
      .delete(`/auth/trainers/delete/${invalidId}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid id");
  });

  // delete all trainers tests
  test("Delete all trainers when trainers exist", async () => {
    // Create multiple trainers
    await Trainer.create([
      {
        username: "trainer10",
        email: "trainer10@example.com",
        password: "password1",
        fullname: "Trainer Onety",
        trainer_role: "role1",
      },
      {
        username: "trainer20",
        email: "trainer20@example.com",
        password: "password2",
        fullname: "Trainer Twoty",
        trainer_role: "role2",
      },
    ]);

    const response = await supertest(app)
      .delete("/auth/delete-all-trainers")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("All trainers deleted successfully");

    const trainers = await Trainer.find({});
    expect(trainers.length).toBe(0);
  });

  test("Delete all trainers when no trainers exist", async () => {
    const response = await supertest(app)
      .delete("/auth/delete-all-trainers")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No trainers found to delete");
  });
});
