const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");
const bcrypt = require("bcrypt");

jest.mock("../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test-secret";
});

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    prisma.user.findUnique.mockResolvedValue(null); // No existing user
    prisma.user.create.mockResolvedValue({
      id: "1",
      name: "Test User",
      email: "test@example.com",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.name).toEqual("Test User");
  });

  it("should block duplicate email on register", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "1", email: "test@example.com" });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("User already exists");
  });

  it("should login successfully", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    prisma.user.findUnique.mockResolvedValue({
      id: "1",
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid password on login", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    prisma.user.findUnique.mockResolvedValue({
      id: "1",
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Invalid credentials");
  });
});
