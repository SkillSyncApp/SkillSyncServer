import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initApp from "../app";
import User from "../models/user";

describe("User Endpoints", () => {
  let accessToken: string;
  let userId: string;

  let app: Express;

  const userData = {
    name: "Nofar Shapir",
    email: "nofarshapir00@example.com",
    password: "password123",
    type: "student",
    bio: "Sample bio",
  };

  const userData2 = {
    name: "Amit Brickman",
    email: "amit.brickman@gmail.com",
    password: "password123",
    type: "student",
    bio: "Sample bio",
  };

  beforeAll(async () => {
    app = await initApp();

    await User.deleteMany({
      email: { $in: [userData.email, userData2.email] },
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(201);

    const response2 = await request(app)
      .post("/api/auth/register")
      .send(userData2);
    expect(response.statusCode).toBe(201);

    const authResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    await request(app)
      .post("/api/auth/login")
      .send({ email: userData2.email, password: userData2.password });

    accessToken = authResponse.body.accessToken;
    userId = authResponse.body.user._id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: userData.email });

    // Close the MongoDB connection
    await mongoose.connection.close();
  }, 10000);

  describe("GET /api/users/:id", () => {
    test("should get user details by ID", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", userData.name);
      expect(response.body).toHaveProperty("email", userData.email);
    });
  });

  test("should get all user details", async () => {
    const response = await request(app)
      .get(`/api/users`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((user) => {
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
    });
  });
});
