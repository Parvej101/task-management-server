import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MONGO_USER, MONGO_PASSWORD } = process.env;

// Construct Mongo URI
const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.mongodb.net/taskManagementDB?retryWrites=true&w=majority`;

const client = new MongoClient(mongoURI);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
    return client.db("taskManagementDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// API Route Example
app.get("/tasks", async (req, res) => {
  const db = await connectDB();
  const tasksCollection = db.collection("tasks");
  const tasks = await tasksCollection.find({}).toArray();
  res.json(tasks);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
