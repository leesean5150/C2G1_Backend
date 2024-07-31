import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { WorkshopSummary } from "../workshop/models/WorkshopSummary";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest";
import { exec } from "child_process";

describe("Testing Graph Functionality", () => {
  let app;
  let tokenValue;
  let workshopRequestId;
  let workshopDataIds = [];
  let clientId;
  let trainerIds = [];
  let workshopSummaryIds = [];

  beforeAll(async () => {
      app = await initializeApp();
      if (!app) {
        throw new Error("App initialization failed");
      }

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

      //3. reset workshopSummary, workshopRequest, workshopData, trainers
      await supertest(app)
        .delete("/workshopsummary/delete-all")
        .set("Cookie", `token=${tokenValue}`);

      await supertest(app)
        .delete("/workshoprequest/delete-all")
        .set("Cookie", `token=${tokenValue}`);

      await supertest(app)
        .delete("/workshopdata/delete-all")
        .set("Cookie", `token=${tokenValue}`);

      await supertest(app)
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
        client_type: "Executive",
        workshop_request: [],
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
          workshops_completed_this_month: 0,
          experience: 0,
          gender: "male",
          ongoing_workshops: 0,
          workshops_completed_total: 0,
          workshop_request: [],
          unavailableTimeslots: [],
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
          workshops_completed_this_month: 1,
          experience: 0,
          gender: "male",
          ongoing_workshops: 0,
          workshops_completed_total: 0,
          workshop_request: [],
          unavailableTimeslots: [],
        });

      expect(trainerResponse1.status).toBe(200);
      expect(trainerResponse2.status).toBe(200);

      trainerIds.push(trainerResponse1.body._id, trainerResponse2.body._id);

      //7. Workshop Request preparation
      const workshopRequestResponse = await supertest(app)
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

      expect(workshopRequestResponse.status).toBe(201);
      expect(workshopRequestResponse.body).toHaveProperty(
        "message",
        "Workshop request created successfully"
      );

      workshopRequestId = workshopRequestResponse.body.workshopRequest._id;

      const addTrainerResponse = await supertest(app)
        .patch(`/workshoprequest/approve/${workshopRequestId}`)
        .set("Cookie", `token=${tokenValue}`)
        .send({
          trainerIds,
        });

      expect(addTrainerResponse.status).toBe(200);
      expect(addTrainerResponse.body).toHaveProperty("status", "approved");
      expect(addTrainerResponse.body).toHaveProperty("trainers");
      expect(addTrainerResponse.body.trainers.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (app && app.close) {
      await app.close();
    }
  });

  test("should create workshop summaries for all months and years", async () => {
    const response = await supertest(app)
      .post("/workshopsummary/create-default-workshop-summaries")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Workshop summaries created successfully"
    );
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(60); // 5 years * 12 months = 60

    // Verify database entries
    const summaries = await WorkshopSummary.find();
    expect(summaries.length).toBe(60);

    const expectedMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const expectedYears = [2021, 2022, 2023, 2024, 2025];

    summaries.forEach((summary) => {
      expect(expectedYears).toContain(summary.year);
      expect(expectedMonths).toContain(summary.month);
    });
  });

  test("should get all workshop summaries", async () => {
    const response = await supertest(app)
      .get("/workshopsummary")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);

    const summaries = response.body;
    expect(summaries.length).toBe(60);

    const expectedMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const expectedYears = [2021, 2022, 2023, 2024, 2025];

    summaries.forEach((summary) => {
      expect(expectedYears).toContain(summary.year);
      expect(expectedMonths).toContain(summary.month);
      workshopSummaryIds.push(summary._id);
    });

    expect(workshopSummaryIds.length).toBe(60);
  });

  test("should get single workshop summary by id", async () => {
    const response = await supertest(app)
      .get(`/workshopsummary/get/${workshopSummaryIds[0]}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);

    const summary = response.body;
    expect(summary.month).toBe("Jan");
    expect(summary.year).toBe(2021);
  });

  test("should get 5 summaries by searching", async () => {
    const response = await supertest(app)
      .get(`/workshopsummary/search`)
      .set("Cookie", `token=${tokenValue}`)
      .send({
        attributeName: "month",
        attributeContent: "Jan",
      });

    expect(response.status).toBe(200);
    const summaries = response.body;
    expect(summaries.length).toBe(5);
    expect(summaries[0].year).toBe(2021);
  });

  test("should update workshop summary", async () => {
    const response = await supertest(app)
      .patch("/workshopsummary/add-workshop-request")
      .set("Cookie", `token=${tokenValue}`)
      .send({
        workshopRequestId: workshopRequestId,
        workshopSummaryId: workshopSummaryIds[0],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Successfully added workshop to workshop summary"
    );

    const summary = response.body.updatedWorkshopSummary;
    expect(summary.workshopRequests.length).toBe(1);
    expect(summary.workshopRequests[0]).toBe(workshopRequestId);
  });

  test("should delete single summary", async () => {
    const response = await supertest(app)
      .delete(`/workshopsummary/${workshopSummaryIds[0]}`)
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(204);

    const summaries = await WorkshopSummary.find();
    expect(summaries.length).toBe(59);
  });

  test("the type of data and length of data for getTotalPieChartGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getTotalPieChartGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(3);

    const expectedNames = [
      "Workshops accepted",
      "Workshops rejected",
      "pending",
    ];
    response.body.forEach((item, index) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("value");
      expect(item.name).toBe(expectedNames[index]);
      expect(typeof item.value).toBe("number");
    });
    expect(response.body[0].value).toBe(1);
  });

  test("the type of data and length of data for getYearsPieChartGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getYearsPieChartGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Object.keys(response.body).length).toBe(4); // There are 4 years (2022, 2023, 2024, 2025)

    const expectedYears = [2022, 2023, 2024, 2025];

    expectedYears.forEach((year) => {
      expect(response.body).toHaveProperty(year.toString());
      expect(response.body[year.toString()]).toBeInstanceOf(Array);
      expect(response.body[year.toString()].length).toBe(3);

      const expectedNames = [
        "Workshops accepted",
        "Workshops rejected",
        "pending",
      ];

      response.body[year.toString()].forEach((item, index) => {
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("value");
        expect(item.name).toBe(expectedNames[index]);
        expect(typeof item.value).toBe("number");
      });
    });

    expect(response.body["2024"][0].value).toBe(1);
  });

  test("the type of data and length of data for getWorkshopTypesGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getWorkshopTypesGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("dealSize");
    expect(response.body[0].name).toBe("Type 1");
    expect(typeof response.body[0].dealSize).toBe("number");
    expect(response.body[0].dealSize).toBe(1000);
  });

  test("the type of data and length of data for getClientTypeGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getClientTypeGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("dealSize");
    expect(response.body[0].name).toBe("Executive");
    expect(typeof response.body[0].dealSize).toBe("number");
    expect(response.body[0].dealSize).toBe(1000);
  });

  test("the type of data and length of data for getWorkshopTrendDataGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getWorkshopTrendDataGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toHaveProperty("month");
    expect(response.body[0]).toHaveProperty("workshopRequests2024");
    expect(response.body[0].month).toBe("Aug");
    expect(response.body[0].workshopRequests2024).toBe(1);
    expect(response.body[0].dealSize2024).toBe(1000);
  });

  test("the type of data and length of data for getTrainerUtilGraph", async () => {
    const response = await supertest(app)
      .get("/graph/getTrainerUtilGraph")
      .set("Cookie", `token=${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);

    const expectedNames = ["Trainer One", "Trainer Two"];
    response.body.forEach((item, index) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("ongoing_workshops");
      expect(item).toHaveProperty("total_trainer_utilization");
      expect(item).toHaveProperty("workshops_completed_total");
      expect(item.name).toBe(expectedNames[index]);
      expect(typeof item.workshops_completed_total).toBe("number");
      expect(typeof item.ongoing_workshops).toBe("number");
      expect(typeof item.total_trainer_utilization).toBe("number");
    });
  });
});
