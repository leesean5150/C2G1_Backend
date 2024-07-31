import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest";
import { WorkshopData } from "../workshop/models/WorkshopData";
import { CLIENT_RENEG_WINDOW } from "tls";
import { resolve } from "path";

describe("WorkshopData CRUD operations", () => {
  let app;
  let tokenValue;
  let workshopRequestId;
  let workshopDataIds = [];
  let clientId;
  let trainerIds = [];

  beforeAll(async () => {
    try {
      //1. Init App
      app = await initializeApp();

      //2-1. Login Admin (Superuser)
      const response_login = await supertest(app)
        .post("/auth/login/admin")
        .send({
          username: process.env.SUPERUSER_USERNAME,
          password: process.env.SUPERUSER_PASSWORD,
        });
      const tokenCookie = response_login.headers["set-cookie"].find((cookie) =>
        cookie.startsWith("token=")
      );

      //2-2. Store tokenValue for superuser
      tokenValue = tokenCookie.split("=")[1].split(";")[0];

      //3. reset workshopData, workshopRequest, trainers
      const workshopDataDeleteResponse = await supertest(app)
        .delete("/workshopdata/delete-all")
        .set("Cookie", `token=${tokenValue}`);

      //expect(workshopDataDeleteResponse.status).toBe(200);

      const workshopRequestDeleteResponse = await supertest(app)
        .delete("/workshoprequest/delete-all")
        .set("Cookie", `token=${tokenValue}`);

      //expect(workshopRequestDeleteResponse.status).toBe(200);

      const trainerDeleteResponse = await supertest(app)
        .delete("/auth/delete-all-trainers")
        .set("Cookie", `token=${tokenValue}`);

      // 4. Create WorkshopData entries (Preparation)
      const numbers = [1, 2, 3];
      for (let i of numbers) {
        const response = await supertest(app)
          .post("/workshopdata")
          .set("Cookie", `token=${tokenValue}`)
          .send({
            workshop_ID: `ID${i}`,
            workshop_name: `Test Workshop ${i}`,
            workshop_type: `Type ${i}`,
            workshop_details: `Details ${i}`,
          });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        let workshopDataId = response.body._id;
        workshopDataIds.push(workshopDataId);
      }

      //5. Client Preparation
      const response = await supertest(app).post("/auth/signup").send({
        username: "client",
        password: "client",
        email: "client@gmail.com",
        country: "Singapore",
        fullname: "Client",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(response.status).toBe(200);

      const clientResponse = await supertest(app).get(
        "/auth/get-user-id/client"
      );
      clientId = clientResponse.body.userId;

      //6. Trainer Preparation
      const trainerResponse1 = await supertest(app)
        .post("/auth/trainers")
        .set("Cookie", `token=${tokenValue}`)
        .send({
          username: "trainer1",
          password: "trainer1",
          email: "trainer1@gmail.com",
          fullname: "Trainer One",
          trainer_role: "role1",
        });

      const trainerResponse2 = await supertest(app)
        .post("/auth/trainers")
        .set("Cookie", `token=${tokenValue}`)
        .send({
          username: "trainer2",
          password: "trainer2",
          email: "trainer2@gmail.com",
          fullname: "Trainer Two",
          trainer_role: "role2",
        });

      expect(trainerResponse1.status).toBe(200);
      expect(trainerResponse2.status).toBe(200);

      trainerIds.push(trainerResponse1.body._id, trainerResponse2.body._id);
    } catch (error) {
      console.error("Setup error:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
      if (app && app.close) {
        await app.close();
      }
    } catch (error) {
      console.error("Teardown error:", error);
    }
  });

  test("should create a new WorkshopRequest", async () => {
    const response = await supertest(app)
      .post("/workshoprequest")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        company_role: "Manager",
        company: "Test Company",
        name: "John Doe",
        email: "john.doe@example.com",
        phone_number: 1234567890,
        pax: 10,
        deal_potential: 1000,
        country: "Singapore",
        venue: "Test Venue",
        start_date: "2024-08-21",
        end_date: "2024-08-22",
        request_message: "Test message",
        workshop_data_id: "ID1",
        client_id: clientId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Workshop request created successfully"
    );

    workshopRequestId = response.body.workshopRequest._id;
  });
  test("should return a certain workshoprequest entity", async () => {
    const response = await supertest(app)
      .get(`/workshoprequest/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);

    const workshopRequest = response.body;
    expect(workshopRequest).toHaveProperty("request_message", "Test message");
    expect(workshopRequest).toHaveProperty("_id", workshopRequestId);
  });

  test("should return list including one entity", async () => {
    const response = await supertest(app)
      .get("/workshoprequest")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1); // we expect only one entry since we created one in the previous test

    const workshopRequest = response.body[0];
    expect(workshopRequest).toHaveProperty("_id", workshopRequestId);
    expect(workshopRequest).toHaveProperty("company_role", "Manager");
    expect(workshopRequest).toHaveProperty("company", "Test Company");
    expect(workshopRequest).toHaveProperty("name", "John Doe");
    expect(workshopRequest).toHaveProperty("email", "john.doe@example.com");
    expect(workshopRequest).toHaveProperty("phone_number", 1234567890);
    expect(workshopRequest).toHaveProperty("pax", "10");
    expect(workshopRequest).toHaveProperty("deal_potential", 1000);
    expect(workshopRequest).toHaveProperty("country", "Singapore");
    expect(workshopRequest).toHaveProperty("venue", "Test Venue");
    expect(workshopRequest).toHaveProperty(
      "start_date",
      "2024-08-21T00:00:00.000Z"
    );
    expect(workshopRequest).toHaveProperty(
      "end_date",
      "2024-08-22T00:00:00.000Z"
    );
    expect(workshopRequest).toHaveProperty("request_message", "Test message");
    expect(workshopRequest.workshop_data).toHaveProperty("workshop_ID", "ID1");
    expect(workshopRequest.client).toHaveProperty("_id", clientId);
  });

  test("should return list including one entity", async () => {
    const response = await supertest(app)
      .get("/workshoprequest/getSubmitted")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1); // we expect only one entry since we created one in the previous test

    const workshopRequest = response.body[0];
    expect(workshopRequest).toHaveProperty("_id", workshopRequestId);
    expect(workshopRequest).toHaveProperty("company_role", "Manager");
    expect(workshopRequest).toHaveProperty("company", "Test Company");
    expect(workshopRequest).toHaveProperty("name", "John Doe");
    expect(workshopRequest).toHaveProperty("email", "john.doe@example.com");
    expect(workshopRequest).toHaveProperty("phone_number", 1234567890);
    expect(workshopRequest).toHaveProperty("pax", "10");
    expect(workshopRequest).toHaveProperty("deal_potential", 1000);
    expect(workshopRequest).toHaveProperty("country", "Singapore");
    expect(workshopRequest).toHaveProperty("venue", "Test Venue");
    expect(workshopRequest).toHaveProperty(
      "start_date",
      "2024-08-21T00:00:00.000Z"
    );
    expect(workshopRequest).toHaveProperty(
      "end_date",
      "2024-08-22T00:00:00.000Z"
    );
    expect(workshopRequest).toHaveProperty("request_message", "Test message");
    expect(workshopRequest.workshop_data).toHaveProperty("workshop_ID", "ID1");

    expect(workshopRequest.client.toString()).toBe(clientId.toString());
  });

  test("should approve the WorkshopRequest and add trainers", async () => {
    const response = await supertest(app)
      .patch(`/workshoprequest/approve/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        trainerIds,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "approved");
    expect(response.body).toHaveProperty("trainers");
    expect(response.body.trainers.length).toBe(2);
  });

  test("should return list including single approved workshopRequest entity", async () => {
    const response = await supertest(app)
      .get(`/workshoprequest/getApproved`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);

    expect(response.body.length).toBe(1);
    const workshopRequest = response.body[0];
    console.log(workshopRequest);
    expect(workshopRequest[0].status).toBe("approved");
  });

  test("should reject the WorkshopRequest", async () => {
    const response = await supertest(app)
      .patch(`/workshoprequest/reject/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        rejectReason: "Not enough budget",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "rejected");
    expect(response.body).toHaveProperty("reject_reason", "Not enough budget");
  });

  test("should update the WorkshopRequest", async () => {
    const response = await supertest(app)
      .patch(`/workshoprequest/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        company_role: "Director",
        company: "Updated Company",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone_number: 9876543210,
        pax: 20,
        deal_potential: 2000,
        country: "Malaysia",
        venue: "Updated Venue",
        start_date: "2024-08-21",
        end_date: "2024-08-22",
        request_message: "Updated message",
        workshop_id: "ID2",
      });

    expect(response.status).toBe(200);

    const updatedWorkshopRequest = response.body;
    expect(updatedWorkshopRequest).toHaveProperty("company_role", "Director");
    expect(updatedWorkshopRequest).toHaveProperty("company", "Updated Company");
    expect(updatedWorkshopRequest).toHaveProperty("name", "Jane Doe");
    expect(updatedWorkshopRequest).toHaveProperty(
      "email",
      "jane.doe@example.com"
    );
    expect(updatedWorkshopRequest).toHaveProperty("phone_number", 9876543210);
    expect(updatedWorkshopRequest).toHaveProperty("pax", "20");
    expect(updatedWorkshopRequest).toHaveProperty("deal_potential", 2000);
    expect(updatedWorkshopRequest).toHaveProperty("country", "Malaysia");
    expect(updatedWorkshopRequest).toHaveProperty("venue", "Updated Venue");
    expect(updatedWorkshopRequest).toHaveProperty(
      "start_date",
      "2024-08-21T00:00:00.000Z"
    );
    expect(updatedWorkshopRequest).toHaveProperty(
      "end_date",
      "2024-08-22T00:00:00.000Z"
    );
    expect(updatedWorkshopRequest).toHaveProperty(
      "request_message",
      "Updated message"
    );
    expect(updatedWorkshopRequest).toHaveProperty(
      "workshop_data",
      workshopDataIds[1]
    );
  });

  test("should delete the workshopRequest", async () => {
    const response = await supertest(app)
      .delete(`/workshoprequest/${workshopRequestId}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);

    const msg = response.body;
    expect(msg).toHaveProperty(
      "message",
      "Workshop request deleted successfully"
    );
  });
});
