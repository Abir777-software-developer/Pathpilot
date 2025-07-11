import { Roadmap } from "../models/Roadmapmodel.js";
import expressAsyncHandler from "express-async-handler";

export const getRoadmapBySlug = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const roadmap = await Roadmap.findOne({ slug });

  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }
  res.json(roadmap);
});
