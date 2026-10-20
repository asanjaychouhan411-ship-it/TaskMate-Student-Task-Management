
const { test, describe, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, Task } = require("./server");

const validId = "507f1f77bcf86cd799439011";

const originalMethods = {
  find: Task.find,
  create: Task.create,
  findById: Task.findById,
  findByIdAndUpdate: Task.findByIdAndUpdate,
  findByIdAndDelete: Task.findByIdAndDelete,
};

after(() => {
  Object.assign(Task, originalMethods);
});

describe("TaskMate Backend API Tests", () => {
  test("1. Home route should return API status", async () => {
    const res = await request(app).get("/");

    assert.equal(res.status, 200);
    assert.equal(
      res.body.message,
      "TaskMate Backend API is running!"
    );
  });

  test("2. GET tasks should return a task list", async () => {
    Task.find = () => ({
      sort: async () => [
        { _id: validId, title: "Test Task", completed: false },
      ],
    });

    const res = await request(app).get("/api/tasks");

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].title, "Test Task");
  });

  test("3. POST should reject an empty task title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "   " });

    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Task title is required");
  });

  test("4. POST should create a task", async () => {
    Task.create = async (data) => ({
      _id: validId,
      ...data,
    });

    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "  Week 5 Testing  ",
        description: "Backend test",
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.task.title, "Week 5 Testing");
    assert.equal(res.body.task.description, "Backend test");
    assert.equal(res.body.task.completed, false);
  });

  test("5. GET should reject an invalid task ID", async () => {
    const res = await request(app).get("/api/tasks/invalid-id");

    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Invalid task ID");
  });

  test("6. GET should return 404 for a missing task", async () => {
    Task.findById = async () => null;

    const res = await request(app).get(`/api/tasks/${validId}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Task not found");
  });

  test("7. PUT should reject an empty title", async () => {
    const res = await request(app)
      .put(`/api/tasks/${validId}`)
      .send({ title: " " });

    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Title must not be empty");
  });

  test("8. PUT should reject an invalid completed value", async () => {
    const res = await request(app)
      .put(`/api/tasks/${validId}`)
      .send({ completed: "yes" });

    assert.equal(res.status, 400);
    assert.equal(
      res.body.message,
      "Completed must be true or false"
    );
  });

  test("9. DELETE should return 404 for a missing task", async () => {
    Task.findByIdAndDelete = async () => null;

    const res = await request(app).delete(`/api/tasks/${validId}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, "Task not found");
  });

  test("10. PUT and DELETE should reject invalid IDs", async () => {
    const updateRes = await request(app)
      .put("/api/tasks/invalid-id")
      .send({ completed: true });

    const deleteRes = await request(app)
      .delete("/api/tasks/invalid-id");

    assert.equal(updateRes.status, 400);
    assert.equal(deleteRes.status, 400);
  });
});
