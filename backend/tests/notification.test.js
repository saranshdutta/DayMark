const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/utils/prisma");
const jwt = require("jsonwebtoken");

jest.mock("../src/utils/prisma", () => ({
  user: { findUnique: jest.fn() },
  notification: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

describe("Notification Endpoints", () => {
  it("should retrieve notifications", async () => {
    const token = generateTestToken();
    
    prisma.notification.findMany.mockResolvedValue([
      { id: "notif1", userId: "user1", title: "Test Notif", isRead: false },
    ]);

    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it("should mark all as read", async () => {
    const token = generateTestToken();
    
    prisma.notification.updateMany.mockResolvedValue({ count: 2 });

    const res = await request(app)
      .patch("/api/notifications/read-all")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it("should mark a single notification as read", async () => {
    const token = generateTestToken();
    
    prisma.notification.findUnique.mockResolvedValue({ id: "notif1", userId: "user1" });
    prisma.notification.update.mockResolvedValue({ id: "notif1", isRead: true });

    const res = await request(app)
      .patch("/api/notifications/notif1/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isRead).toEqual(true);
  });
  
  it("should block updating another user's notification", async () => {
    const token = generateTestToken();
    
    prisma.notification.findUnique.mockResolvedValue({ id: "notif1", userId: "user2" });

    const res = await request(app)
      .patch("/api/notifications/notif1/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
  });

  it("should delete a notification", async () => {
    const token = generateTestToken();
    
    prisma.notification.findUnique.mockResolvedValue({ id: "notif1", userId: "user1" });
    prisma.notification.delete.mockResolvedValue({ id: "notif1" });

    const res = await request(app)
      .delete("/api/notifications/notif1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });
});
