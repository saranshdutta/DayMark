const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");
const jwt = require("jsonwebtoken");

jest.mock("../src/utils/prisma", () => ({
  user: { findUnique: jest.fn() },
  goal: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  activityLog: {
    findMany: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test-secret";
  
  prisma.user.findUnique.mockResolvedValue({
    id: "user1",
    name: "Test User",
    email: "test@example.com",
  });
});

const generateTestToken = () => {
  return jwt.sign({ id: "user1" }, "test-secret");
};

describe("Goal Endpoints", () => {
  it("should create a goal", async () => {
    const token = generateTestToken();
    prisma.goal.create.mockResolvedValue({
      id: "goal1",
      userId: "user1",
      title: "Read a book",
      targetValue: 30,
      unit: "pages",
      frequency: "DAILY",
      startDate: new Date(),
    });

    const res = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Read a book",
        targetValue: 30,
        unit: "pages",
        frequency: "DAILY",
        startDate: new Date(),
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual("Read a book");
  });

  it("should retrieve goal progress", async () => {
    const token = generateTestToken();
    
    // Mock the goals
    prisma.goal.findMany.mockResolvedValue([
      { id: "goal1", userId: "user1", title: "Read a book", targetValue: 30, activityId: "act1" },
    ]);
    
    // Mock the activity logs
    prisma.activityLog.findMany.mockResolvedValue([
      { value: 10 },
      { value: 5 }
    ]);

    const res = await request(app)
      .get("/api/goals/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].currentProgress).toEqual(15);
    expect(res.body[0].percentage).toEqual(50);
  });
});
