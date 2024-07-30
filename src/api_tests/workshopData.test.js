import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { WorkshopData } from "../workshop/models/WorkshopData";

describe("WorkshopData CRUD operations", () => {
    let app;
    let tokenValue;
    let workshopDataIds = [];

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

            //3. reset workshopData
            const deleteResponse = await supertest(app)
                .delete("/workshopdata/delete-all")
                .set('Cookie', `token=${tokenValue}`);

            expect(deleteResponse.status).toBe(200);

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

    test("should create a new WorkshopData (3 entities)", async() => {
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
    });

    test("should get all WorkshopData entities", async() => {
        const response = await supertest(app)
            .get("/workshopdata")
            .set('Cookie', `token=${tokenValue}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(workshopDataIds.length);

        for (let workshopData of response.body) {
            expect(workshopDataIds).toContain(workshopData._id);
        }
    });

    test("should update a WorkshopData entity", async() => {
        const workshopDataId = workshopDataIds[0];
        const response = await supertest(app)
            .patch(`/workshopdata/${workshopDataId}`)
            .set('Cookie', `token=${tokenValue}`)
            .send({
                workshop_name: "Updated Workshop",
                workshop_details: "This is an updated test workshop"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", workshopDataId);
        expect(response.body.workshop_name).toBe("Updated Workshop");
        expect(response.body.workshop_details).toBe("This is an updated test workshop");
    });

    test("should return a certain WorkshopData entity", async() => {
        const workshopDataId = workshopDataIds[0];
        const response = await supertest(app)
            .get(`/workshopdata/${workshopDataId}`)
            .set('Cookie', `token=${tokenValue}`);

        expect(response.status).toBe(200);

        const workshopData = response.body;

        expect(workshopData).toHaveProperty("_id", workshopDataId);
        expect(workshopData.workshop_name).toBe("Updated Workshop");
    });

    test("should delete a WorkshopData entity", async() => {
        const workshopDataId = workshopDataIds[0];
        const response = await supertest(app)
            .delete(`/workshopdata/${workshopDataId}`)
            .set('Cookie', `token=${tokenValue}`);

        expect(response.status).toBe(200);
    });

    test("should get 2 available WorkshopData entities", async() => {
        const response = await supertest(app)
            .get(`/workshopdata/available`)
            .set('Cookie', `token=${tokenValue}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });
});