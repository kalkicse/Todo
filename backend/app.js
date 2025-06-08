// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("🌟 MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Task model
const Task = mongoose.model("Task", new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
}));

// CRUD routes
app.get("/tasks", async (_, res) => res.json(await Task.find()));
app.post("/tasks", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json(task);
});
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running on port", process.env.PORT || 5000));
