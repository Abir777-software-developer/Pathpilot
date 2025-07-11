import { User } from "../models/Usermodel.js";
import expressAsyncHandler from "express-async-handler";
export const getProgress = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const pro = user.progress.find((p) => p.roadmapslug == slug);
  res.json(pro || { roadmapslug: slug, completedResources: [] });
});
export const updateProgress = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { completedResources } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const progress = user.progress.find((p) => p.roadmapslug === slug);

  if (progress) {
    progress.completedResources = completedResources;
  } else {
    user.progress.push({ roadmapslug: slug, completedResources });
  }

  await user.save();
  res.json({ message: "Progress updated", progress });
});
