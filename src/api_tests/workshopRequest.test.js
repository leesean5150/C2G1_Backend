import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { WorkshopRequest } from "../workshop/models/WorkshopRequest";
import { WorkshopData } from "../workshop/models/WorkshopData";

describe("WorkshopData CRUD operations", () => {
    let app;
    let tokenValue;
    let workshopRequestIds = [];
    let workshopDataIds = [];
    let clientId;

    beforeAll(async() => {
        try {
            //1. Init App
            app = await initializeApp();

            //2-1. Login Admin (Superuser)
            const response_login = await supertest(app).post("/auth/login/admin").send({
                username: process.env.SUPERUSER_USERNAME,
                password: process.env.SUPERUSER_PASSWORD,
            });
            const tokenCookie = response_login.headers['set-cookie'].find(cookie =>
                cookie.startsWith('token=')
            );

            //2-2. Store tokenValue for superuser
            tokenValue = tokenCookie.split('=')[1].split(';')[0];

            //3. reset workshopData & workshopRequest
            const workshopDataDeleteResponse = await supertest(app)
                .delete("/workshopdata/delete-all")
                .set('Cookie', `token=${tokenValue}`);

            //expect(workshopDataDeleteResponse.status).toBe(200);

            const workshopRequestDeleteResponse = await supertest(app)
                .delete("/workshoprequest/delete-all")
                .set('Cookie', `token=${tokenValue}`);

            //expect(workshopRequestDeleteResponse.status).toBe(200);

            // 4. Create WorkshopData entries (Preparation)
            const numbers = [1, 2, 3];
            for (let i of numbers) {
                const response = await supertest(app)
                    .post("/workshopdata")
                    .set('Cookie', `token=${tokenValue}`)
                    .send({
                        workshop_ID: `ID${i}`,
                        workshop_name: `Test Workshop ${i}`,
                        workshop_type: `Type ${i}`,
                        workshop_details: `Details ${i}`
                    });
                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty("_id");
                let workshopDataId = response.body._id;
                workshopDataIds.push(workshopDataId);
            }

            //5. Client
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

            const clientResponse = await supertest(app).get("/auth/get-user-id/client");
            clientId = clientResponse.body.userId;

        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    afterAll(async() => {
        try {
            console.log("Closing database connection...");
            await mongoose.disconnect();
            console.log("Database connection closed.");
        } catch (error) {
            console.error("Teardown error:", error);
        }
    });

    test("should create a new WorkshopRequest", async() => {
        const response = await supertest(app)
            .post("/workshoprequest")
            .set('Cookie', `token=${tokenValue}`)
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
                start_date: "2024-07-21",
                end_date: "2024-07-22",
                request_message: "Test message",
                workshop_data_id: "ID1",
                client_id: clientId
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Workshop request created successfully");

        workshopRequestIds[0] = response.body._id;
    });

});