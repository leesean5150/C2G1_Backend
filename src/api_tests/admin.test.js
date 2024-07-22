import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("Testing Admin Functionality", () => {
    let app;
    let tokenValue;

    beforeAll(async() => {
        app = await initializeApp();
    });

    test("testing login with superuser account", async() => {
        const response = await supertest(app).post("/auth/login/admin").send({
            username: process.env.SUPERUSER_USERNAME,
            password: process.env.SUPERUSER_PASSWORD,
        });
        const tokenCookie = response.headers['set-cookie'].find(cookie =>
            cookie.startsWith('token=')
        );
        tokenValue = tokenCookie.split('=')[1].split(';')[0];
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.status).toBe(200);
    });

    test("testing verification of logged-in admin", async() => {
        const response = await supertest(app)
            .get("/auth/verify")
            .set('Cookie', `token=${tokenValue}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe("Authorized");
        expect(response.body.role).toBe("admin");
    });

    test("testing verification without a token (unauthorized)", async() => {
        const response = await supertest(app).get("/auth/verify");
        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Unauthorized");
    });

    test("testing verification with an invalid token (unauthorized)", async() => {
        const response = await supertest(app)
            .get("/auth/verify")
            .set('Cookie', `token=invalidtoken`);

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe("Unauthorized");
    });

    test("testing creation trainer account", async() => {
        // test the creation of a trainer account
        // status should be 200
        // maybe check if trainer list is non-zero?
    });

    test("testing allocation of trainer to workshop", async() => {
        // create a workshop
        // test the allocation of a trainer to a workshop
        // status should be 200
        // maybe check if workshop has a trainer?
    });

    test("testing logout of admin account", async() => {
        const response = await supertest(app)
            .get("/auth/verify")
            .set('Cookie', `token=${tokenValue}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe("Authorized");
        expect(response.body.role).toBe("admin");
        const response1 = await supertest(app).get("/auth/logout");
        expect(response1.status).toBe(200);
        expect(response1.body.status).toBe(true);
        expect(response1.body.message).toBe("Logged out");
        const verifyResponse = await supertest(app).get("/auth/verify");
        expect(verifyResponse.status).toBe(401);
    });

    afterAll(async() => {
        await mongoose.disconnect()
    });
});