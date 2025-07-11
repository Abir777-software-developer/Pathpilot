import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./database/data.js";
import userRoutes from "./routes/useRroutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import {
  notFound,
  errorHandler,
} from "./authenticatemiddleware/errormidlleware.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json()); //to accept json data
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/users", userRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
