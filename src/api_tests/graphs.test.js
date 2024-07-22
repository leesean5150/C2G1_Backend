import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";
import { WorkshopSummary } from "../workshop/models/WorkshopSummary";

describe("Testing Graph Functionality", () => {
    let app;
    let tokenValue;

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

            //3. reset workshopSummary
            await supertest(app).delete("/workshopsummary/delete-all");

        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    afterAll(async() => {
        await mongoose.disconnect()
    });

    test("should create workshop summaries for all months and years", async() => {
        const response = await supertest(app)
            .post("/workshopsummary/create-default-workshop-summaries")
            .set('Cookie', `token=${tokenValue}`);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Workshop summaries created successfully");
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBe(60); // 5 years * 12 months = 60

        // Verify database entries
        const summaries = await WorkshopSummary.find();
        expect(summaries.length).toBe(60);

        const expectedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const expectedYears = [2021, 2022, 2023, 2024, 2025];

        summaries.forEach(summary => {
            expect(expectedYears).toContain(summary.year);
            expect(expectedMonths).toContain(summary.month);
        });
    });

});