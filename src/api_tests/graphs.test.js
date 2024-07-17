import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("Testing Graph Functionality", () => {
    let app;
    let tokenValue;

    beforeAll(async() => {
        //1. Init App
        app = await initializeApp();

        //2-1. Login Admin (Superuser)
        const response = await supertest(app).post("/auth/login/admin").send({
            username: process.env.SUPERUSER_USERNAME,
            password: process.env.SUPERUSER_PASSWORD,
        });
        const tokenCookie = response.headers['set-cookie'].find(cookie =>
            cookie.startsWith('token=')
        );

        //2-2. Store tokenValue for superuser
        tokenValue = tokenCookie.split('=')[1].split(';')[0];
    });

});