import express from "express";
import { db } from "../index.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const tasksCollection = "tasks"; // Collection name

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newTask = {
      title,
      description,
      category,
      createdAt: new Date(),
    };
    const result = await db.collection(tasksCollection).insertOne(newTask);
    res.status(201).json({ ...newTask, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await db.collection(tasksCollection).find().toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const taskId = req.params.id;
    const updatedTask = await db.collection(tasksCollection).findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $set: { title, description, category } },
      { returnDocument: "after" }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await db.collection(tasksCollection).deleteOne({ _id: new ObjectId(taskId) });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
});

export default router;
