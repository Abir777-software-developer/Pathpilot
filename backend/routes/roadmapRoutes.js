import express from "express";
import { getRoadmapBySlug } from "../controllers/roadmapControllers.js";
import { protect } from "../authenticatemiddleware/jsontokenuse.js";
const router = express.Router();
router.get("/:slug", protect, getRoadmapBySlug);
export default router;
