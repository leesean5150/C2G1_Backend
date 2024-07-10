import supertest from "supertest";
import initializeApp from "../app";
import mongoose from "mongoose";

describe("Testing Client Endpoints", () => {
  let app;
  let tokenValue;

  beforeAll(async () => {
    app = await initializeApp();
  });

  test("create client account", async () => {
    const response = await supertest(app).post("/auth/signup").send({
      username: "client",
      password: "client",
      email: "client@gmail.com",
    });
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.status).toBe(200);
  });

  test("testing login with client account", async () => {
    const response = await supertest(app).post("/auth/login/client").send({
      username: "client",
      password: "client",
    });
    const tokenCookie = response.headers['set-cookie'].find(cookie => 
      cookie.startsWith('token=')
    );
    tokenValue = tokenCookie.split('=')[1].split(';')[0];
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.status).toBe(200);
  });

  test("testing verification of logged-in client", async () => {
    const response = await supertest(app)
    .get("/auth/verify") 
    .set('Cookie', `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Authorized");
    expect(response.body.role).toBe("client");
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
      .set('Cookie', `token=invalidtoken`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
  });

  test("testing logout of client account", async () => {
    const response = await supertest(app)
    .get("/auth/verify") 
    .set('Cookie', `token=${tokenValue}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Authorized");
    expect(response.body.role).toBe("client");
    const response1 = await supertest(app).get("/auth/logout");
    expect(response1.status).toBe(200);
    expect(response1.body.status).toBe(true);
    expect(response1.body.message).toBe("Logged out");
    const verifyResponse = await supertest(app).get("/auth/verify");
    expect(verifyResponse.status).toBe(401);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
