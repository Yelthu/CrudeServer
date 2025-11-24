// __tests__/tasks.test.ts
import request from "supertest";
import express from "express";
import taskRoutes from "../src/routes/taskRoutes";

// Mock Prisma
jest.mock("../src/prisma", () => {
    const mockTask = {
        id: 1,
        title: "Test task",
        description: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return {
        prisma: {
            task: {
                create: jest.fn().mockResolvedValue(mockTask),
                findMany: jest.fn().mockResolvedValue([mockTask]),
                findUnique: jest.fn().mockResolvedValue(mockTask),
                update: jest.fn().mockResolvedValue({ ...mockTask, title: "Updated", completed: true }),
                delete: jest.fn().mockResolvedValue(mockTask),
                count: jest.fn().mockResolvedValue(1),
            },
            $disconnect: jest.fn(),
        },
    };
});

import { prisma } from "../src/prisma";

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task CRUD API (mocked)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CREATE
    it("POST /api/tasks → should create a task", async () => {
        const res = await request(app).post("/api/tasks").send({ title: "Test task" });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe("Test task");
        expect(prisma.task.create).toHaveBeenCalledWith({ data: { title: "Test task" } });
    });

    // GET ALL (with pagination)
    it("GET /api/tasks → should list tasks with pagination", async () => {
        const res = await request(app).get("/api/tasks").query({ page: "1", limit: "10" });
        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.pagination).toHaveProperty("totalItems", 1);
        expect(prisma.task.findMany).toHaveBeenCalled();
    });

    // GET BY ID
    it("GET /api/tasks/:id → should get one task", async () => {
        const res = await request(app).get("/api/tasks/1");
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Test task");
        expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    // UPDATE
    it("PATCH /api/tasks/:id → should update task", async () => {
        const res = await request(app).patch("/api/tasks/1").send({ title: "Updated", completed: true });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Updated");
        expect(res.body.completed).toBe(true);
        expect(prisma.task.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { title: "Updated", completed: true },
        });
    });

    // DELETE
    it("DELETE /api/tasks/:id → should delete task", async () => {
        const res = await request(app).delete("/api/tasks/1");
        expect(res.status).toBe(204);
        expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});
