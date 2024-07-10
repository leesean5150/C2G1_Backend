import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("GET /products", () => {
  let app;

  beforeAll(async () => {
    app = await initializeApp();
  });

  test("testing Response Status 200 from products endpoint", async () => {
    const res = await supertest(app).get("/products");
    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
