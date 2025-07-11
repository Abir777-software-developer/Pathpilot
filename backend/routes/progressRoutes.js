import express from "express";
import {
  getProgress,
  updateProgress,
} from "../controllers/progressControllers.js";
import { protect } from "../authenticatemiddleware/jsontokenuse.js";

const router = express.Router();
router.get("/:slug", protect, getProgress);
router.put("/:slug", protect, updateProgress);

export default router;
