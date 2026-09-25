const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");
const jwt = require("jsonwebtoken");

jest.mock("../src/utils/prisma", () => ({
  user: { findUnique: jest.fn() },
  activityLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test-secret";
  
  // Mock the user auth
  prisma.user.findUnique.mockResolvedValue({
    id: "user1",
    name: "Test User",
    email: "test@example.com",
  });
});

const generateTestToken = () => {
  return jwt.sign({ id: "user1" }, "test-secret");
};

describe("Activity Endpoints", () => {
  it("should create an activity log", async () => {
    const token = generateTestToken();
    prisma.activityLog.create.mockResolvedValue({
      id: "log1",
      userId: "user1",
      activityId: "act1",
      duration: 30,
      value: 100,
    });

    const res = await request(app)
      .post("/api/activity-logs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        activityId: "act1",
        duration: 30,
        value: 100,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.duration).toEqual(30);
  });

  it("should retrieve activity logs", async () => {
    const token = generateTestToken();
    prisma.activityLog.findMany.mockResolvedValue([
      { id: "log1", userId: "user1", activityId: "act1", duration: 30 },
      { id: "log2", userId: "user1", activityId: "act2", duration: 45 },
    ]);

    const res = await request(app)
      .get("/api/activity-logs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it("should require authentication", async () => {
    const res = await request(app).get("/api/activity-logs");
    expect(res.statusCode).toEqual(401);
  });
});
