const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("./app");

test("Student Management System API", async (t) => {

  await t.test("Health check", async () => {
    const res = await request(app).get("/health");

    assert.equal(res.status, 200);
    assert.equal(res.body.status, "OK");
  });

  await t.test("Get all students", async () => {
    const res = await request(app).get("/api/students");

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 2);
  });

  await t.test("Add a new student", async () => {
    const res = await request(app)
      .post("/api/students")
      .send({
        name: "Test Student",
        rollNo: "999",
        course: "Computer Science"
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.student.name, "Test Student");
  });

  await t.test("Reject invalid student details", async () => {
    const res = await request(app)
      .post("/api/students")
      .send({
        name: "",
        rollNo: "100",
        course: "Computer Science"
      });

    assert.equal(res.status, 400);
  });

  await t.test("Delete a student", async () => {
    const students = await request(app).get("/api/students");
    const student = students.body.find(
      s => s.rollNo === "999"
    );

    const res = await request(app)
      .delete(`/api/students/${student.id}`);

    assert.equal(res.status, 200);
    assert.equal(
      res.body.message,
      "Student deleted successfully"
    );
  });
});
