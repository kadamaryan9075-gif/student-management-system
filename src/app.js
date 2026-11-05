const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let students = [
  {
    id: 1,
    name: "Aryan",
    rollNo: "101",
    course: "Computer Science"
  },
  {
    id: 2,
    name: "Rahul",
    rollNo: "102",
    course: "Information Technology"
  }
];

// Display all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// Add a new student
app.post("/api/students", (req, res) => {
  const { name, rollNo, course } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof rollNo !== "string" || !rollNo.trim() ||
    typeof course !== "string" || !course.trim()
  ) {
    return res.status(400).json({
      message: "Please enter valid student details"
    });
  }

  const student = {
    id: students.length
      ? Math.max(...students.map(s => s.id)) + 1
      : 1,
    name: name.trim(),
    rollNo: rollNo.trim(),
    course: course.trim()
  };

  students.push(student);

  res.status(201).json({
    message: "Student added successfully",
    student
  });
});

// Delete a student
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = students.length;

  students = students.filter(s => s.id !== id);

  if (students.length === oldLength) {
    return res.status(404).json({
      message: "Student not found"
    });
  }

  res.json({
    message: "Student deleted successfully"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
